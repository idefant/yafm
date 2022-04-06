import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import Button from "../Generic/Button";
import FormField from "../Generic/Form/FormField";
import store from "../store";

const Setting: FC = observer(() => {
  const { tg, password } = store.setting;
  const [tgBotToken, setTgBotToken] = useState(tg.botToken);
  const [tgChatId, setTgChatId] = useState(tg.chatId);
  const [backupPassword, setBackupPassword] = useState(password);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    store.setting.setTg(tgBotToken, tgChatId);
    store.setting.setPassword(backupPassword);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Setting!!!</h1>
      <form onSubmit={onSubmit}>
        <FormField
          label="Password"
          type="password"
          value={backupPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setBackupPassword(e.target.value)
          }
        />
        <FormField
          label="Telegram Token"
          value={tgBotToken}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTgBotToken(e.target.value)
          }
        />
        <FormField
          label="Telegram Chat Id"
          value={tgChatId}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTgChatId(e.target.value)
          }
        />
        <Button color="green" type="submit">
          Save
        </Button>
      </form>
    </>
  );
});

export default Setting;
