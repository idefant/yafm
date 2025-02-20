import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { ChangeEvent, FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { appRoutes } from '#data/routes';
import { useAppDispatch } from '#hooks/reduxHooks';
import { baseFileSchema } from '#schema/baseSchema';
import { unlockBase } from '#store/reducers/appSlice';
import ChevronLeftIcon from '#svg/chevron-left.svg?react';
import { BaseFileData } from '#types/baseType';
import { Alert } from '#ui/Alert';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { IconButton } from '#ui/IconButton';
import { dmodal } from '#ui/Modal';
import { HStack } from '#ui/Stack';
import { Title, Text } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { crypt } from '#utils/crypt';
import { readFileContent } from '#utils/file';
import Gzip from '#utils/gzip';
import { checkBaseIntegrity } from '#utils/sync';

const formSchema = z.object({
  password: z.string().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

export const Upload: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const [fileData, setFileData] = useState<BaseFileData>();
  const [alertText, setAlertText] = useState<string>();

  const getPlainData = async (password: string) => {
    if (!fileData) return;
    if (!fileData.isEncrypted) return fileData.data;

    const plaintext = await crypt.decrypt(fileData.data, password);
    if (!plaintext) {
      setAlertText('Wrong password');
      reset({ password: '' });
      return;
    }

    return JSON.parse(await Gzip.decompress(plaintext));
  };

  const onSubmit = async (values: FormOutput) => {
    setAlertText(undefined);
    const data = await getPlainData(values.password);
    if (!data) return;

    await crypt.setSecret({ password: values.password });

    const validatedStatus = checkBaseIntegrity(data);
    if (validatedStatus) {
      dmodal.error({
        title: 'Validate Error',
        content: validatedStatus.error,
        showCancel: false,
      });
      return;
    }

    await committer(actionCreator.importBase(data)).sync();
    dispatch(unlockBase());

    navigate(appRoutes.dashboard);
  };

  const uploadBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if ('files' in input && input.files?.length && input.files?.length > 0) {
      readFileContent(input.files[0])
        .then(async (content) => {
          if (typeof content !== 'string') {
            dmodal.error({
              title: 'Wrong Format',
              showCancel: false,
            });
            return;
          }

          const data = JSON.parse(content);

          const parsingResult = baseFileSchema.safeParse(data);
          if (!parsingResult.success) {
            dmodal.error({
              title: 'File Opening Error',
              content: parsingResult.error.message,
              showCancel: false,
            });
            return;
          }

          setFileData(data);
        })
        .catch(() => {
          dmodal.error({
            title: 'File Opening Error',
            showCancel: false,
          });
        });
    }
  };

  return (
    <>
      <HStack align="center">
        <IconButton
          icon={ChevronLeftIcon}
          color="secondary"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
        <Title level={4}>Upload Base</Title>
      </HStack>

      <Alert text={alertText} />

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <HStack>
            <Text size="lg" color="secondary">
              Base:
            </Text>
            <input type="file" onChange={uploadBackup} />
          </HStack>

          {fileData && (
            <>
              <HStack>
                <Text size="lg" color="secondary">
                  Created at:
                </Text>
                <Text size="lg">{dayjs(fileData.createdAt).format('DD.MM.YYYY (HH:mm)')}</Text>
              </HStack>

              <HStack>
                <Text size="lg" color="secondary">
                  Properties:
                </Text>
                <Text size="lg">{fileData.isEncrypted ? 'Encrypted' : 'Plaintext'}</Text>
              </HStack>

              <Form.Password
                name="password"
                label={fileData.isEncrypted ? 'Password:' : 'New Password'}
                autoFocus
              />

              <HStack justify="center">
                <Button type="submit">Open</Button>
              </HStack>
            </>
          )}
        </Form>
      </FormProvider>
    </>
  );
};
