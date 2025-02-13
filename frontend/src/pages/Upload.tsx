import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { ChangeEvent, FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';

import { appRoutes } from '#data/routes';
import { useAppDispatch } from '#hooks/reduxHooks';
import { unlockBase } from '#store/reducers/appSlice';
import ChevronLeftIcon from '#svg/chevron-left.svg?react';
import { EncryptedData } from '#types/cipher';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { IconButton } from '#ui/IconButton';
import { HStack } from '#ui/Stack';
import { Title, Text } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { crypt } from '#utils/crypt';
import { readFileContent } from '#utils/file';
import Gzip from '#utils/gzip';
import { checkBaseIntegrity } from '#utils/sync';

type FileData = { created_at: string } & (
  | { data: EncryptedData; is_encrypted: true }
  | { data: any; is_encrypted: false }
);

const formSchema = z.object({
  password: z.string().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

export const Upload: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const [fileData, setFileData] = useState<FileData>();

  const getPlainData = async (password: string) => {
    if (!fileData) return;
    if (!fileData.is_encrypted) return fileData.data;

    const plaintext = await crypt.decrypt(fileData.data, password);
    if (!plaintext) {
      Swal.fire({ title: 'Wrong password', icon: 'error' });
      reset({ password: '' });
      return;
    }

    return JSON.parse(await Gzip.decompress(plaintext));
  };

  const onSubmit = async (values: FormOutput) => {
    const data = await getPlainData(values.password);
    if (!data) return;

    await crypt.setSecret({ password: values.password });

    const validatedStatus = checkBaseIntegrity(data);
    if (validatedStatus) {
      Swal.fire({
        title: 'Validate Error',
        text: validatedStatus.error,
        icon: 'error',
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
            Swal.fire({ title: 'Wrong Format', icon: 'error' });
            return;
          }

          const data = JSON.parse(content);
          const schema = z.object({
            created_at: z.string().datetime(),
            is_encrypted: z.boolean(),
            data: z.any(),
          });

          const parsingResult = schema.safeParse(data);
          if (!parsingResult.success) {
            Swal.fire({
              title: 'File Opening Error',
              text: parsingResult.error.message,
              icon: 'error',
            });
            return;
          }

          setFileData(data);
        })
        .catch(() => {
          Swal.fire({ title: 'File Opening Error', icon: 'error' });
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
                <Text size="lg">{dayjs(fileData.created_at).format('DD.MM.YYYY (HH:mm)')}</Text>
              </HStack>

              <HStack>
                <Text size="lg" color="secondary">
                  Properties:
                </Text>
                <Text size="lg">{fileData.is_encrypted ? 'Encrypted' : 'Plaintext'}</Text>
              </HStack>

              <Form.Password
                name="password"
                label={fileData.is_encrypted ? 'Password:' : 'New Password'}
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
