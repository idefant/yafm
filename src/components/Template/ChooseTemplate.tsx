import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import ReactTooltip from "react-tooltip";
import {
  CircleIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  RepeatIcon,
} from "../../assets/svg";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TTemplate, TTransactionType } from "../../types/transactionType";
import ActionButton from "../Generic/Button/ActionButton";
import Modal, { ModalContent, ModalHeader } from "../Generic/Modal";
import Table, { THead, TR, TH, TBody, TD, TDIcon } from "../Generic/Table";

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  setTransaction: (
    template: TTemplate,
    transactionType: TTransactionType
  ) => void;
  transactionType: TTransactionType;
}

const ChooseTemplate: FC<ChooseTemplateProps> = observer(
  ({
    isOpen,
    close,
    setTransaction,
    transactionType: startTransactionType,
  }) => {
    const {
      transaction: { templates, hiddenTemplateIds },
      app: { safeMode },
    } = store;

    const [transactionType, setTransactionType] =
      useState<TTransactionType>("outcome");

    const displayedTemplates = templates
      .filter((template) => template.type === transactionType)
      .filter((template) => !(safeMode && hiddenTemplateIds.has(template.id)));

    const onEnter = () => {
      setTransactionType(startTransactionType);
    };

    return (
      <Modal isOpen={isOpen} close={close} width="biggest" onEnter={onEnter}>
        <ModalHeader close={close}>Choose Template</ModalHeader>
        <ModalContent>
          <div className="flex justify-center gap-6">
            <ActionButton
              onClick={() => setTransactionType("outcome")}
              color="red"
              active={transactionType === "outcome"}
              shadow={transactionType === "outcome"}
            >
              <MinusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => setTransactionType("income")}
              color="green"
              active={transactionType === "income"}
              shadow={transactionType === "income"}
            >
              <PlusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => setTransactionType("exchange")}
              active={transactionType === "exchange"}
              shadow={transactionType === "exchange"}
            >
              <RepeatIcon className="w-7 h-7" />
            </ActionButton>
          </div>

          {displayedTemplates.length === 0 ? (
            <div className="font-sans text-3xl text-center mt-8 mb-3">
              ¯\_(ツ)_/¯
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH></TH>
                  <TH>Name</TH>
                  <TH>Category</TH>
                  <TH>Outcome</TH>
                  <TH>Income</TH>
                  <TH></TH>
                </TR>
              </THead>
              <TBody>
                {displayedTemplates.map((template) => (
                  <TemplateItem
                    template={template}
                    key={template.id}
                    choose={() => {
                      setTransaction(template, transactionType);
                      close();
                    }}
                  />
                ))}
              </TBody>
            </Table>
          )}
        </ModalContent>
      </Modal>
    );
  }
);

interface TemplateItemProps {
  template: TTemplate;
  choose: () => void;
}

const TemplateItem: FC<TemplateItemProps> = observer(({ template, choose }) => {
  const {
    currency: { currencyDict },
    account: { accountDict },
    category: { transactionDict: categoryDict },
  } = store;
  const incomeAccount = template.income?.account_id
    ? accountDict[template.income?.account_id]
    : undefined;
  const outcomeAccount = template.outcome?.account_id
    ? accountDict[template.outcome?.account_id]
    : undefined;

  const incomeCurrency =
    incomeAccount && currencyDict[incomeAccount.currency_code];
  const outcomeCurrency =
    outcomeAccount && currencyDict[outcomeAccount.currency_code];

  const categoryName = template.category_id
    ? categoryDict[template.category_id].name
    : "-";

  return (
    <TR>
      <TD>
        <button onClick={choose}>
          <CircleIcon />
        </button>
      </TD>
      <TD>{template.name}</TD>
      <TD className="text-center">{categoryName}</TD>

      {template.outcome && outcomeCurrency && outcomeAccount ? (
        <TD className="text-right">
          <div className="text-red-700">
            {getCurrencyValue(
              template.outcome.sum,
              outcomeCurrency.decimal_places_number
            )}
            <span className="pl-2.5">{outcomeCurrency.code || ""}</span>
          </div>
          <div className="text-sm text-gray-600">
            {outcomeAccount.name || ""}
          </div>
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      {template.income && incomeCurrency && incomeAccount ? (
        <TD className="text-right">
          <div className="text-green-700">
            {getCurrencyValue(
              template.income.sum,
              incomeCurrency.decimal_places_number
            )}
            <span className="pl-2.5">{incomeCurrency.code || ""}</span>
          </div>
          <div className="text-sm text-gray-600">
            {incomeAccount.name || ""}
          </div>
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      <TDIcon>
        {template.description && (
          <>
            <div data-tip data-for={`tr_${template.id}`} className="px-3">
              <InfoIcon className="w-7 h-7" />
            </div>
            <ReactTooltip
              id={`tr_${template.id}`}
              effect="solid"
              className="max-w-sm"
            >
              {template.description}
            </ReactTooltip>
          </>
        )}
      </TDIcon>
    </TR>
  );
});

export default ChooseTemplate;
