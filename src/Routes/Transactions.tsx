import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { PencilIcon, TrashIcon } from "../assets/svg";
import Button from "../Generic/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import store from "../store";
import SetTransaction from "../Transaction/SetTransaction";
import { TTransaction } from "../types/transaction";

const Transactions: FC = observer(() => {
  const transactions = store.transaction.transactions;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Transactions!!!</h1>
      <Button color="red" onClick={() => setIsOpen(true)}>
        Outcome
      </Button>
      <Button color="green" onClick={() => setIsOpen(true)}>
        Income
      </Button>
      <Button color="gray" onClick={() => setIsOpen(true)}>
        Exchange
      </Button>

      {transactions.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Outcome</TH>
              <TH>Income</TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {transactions.map((transaction) => (
              <TransactionItem transaction={transaction} />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTransaction isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
});

interface TransactionItemProps {
  transaction: TTransaction;
}

const TransactionItem: FC<TransactionItemProps> = observer(
  ({ transaction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const deleteTransaction = () => {
      store.app.closeAlert();
      store.transaction.deleteTransaction(transaction.id);
    };

    const showDeleteModal = () => {
      store.app.openAlert({
        title: "Delete Account",
        type: "error",
        buttons: [
          { text: "Confirm", color: "red", onClick: deleteTransaction },
          { text: "Cancel", onClick: () => store.app.closeAlert() },
        ],
      });
    };

    return (
      <TR>
        <TD>{transaction.name}</TD>
        <TD>{transaction.outcome_sum}</TD>
        <TD>{transaction.income_sum}</TD>
        <TDIcon>
          <button className="p-2" onClick={() => setIsOpen(true)}>
            <PencilIcon className="w-7 h-7" />
          </button>
        </TDIcon>
        <TDIcon>
          <button className="p-2" onClick={showDeleteModal}>
            <TrashIcon className="w-7 h-7" />
          </button>
        </TDIcon>

        <SetTransaction
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          transaction={transaction}
        />
      </TR>
    );
  }
);

export default Transactions;
