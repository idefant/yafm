import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import {
  InfoIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  RepeatIcon,
  TrashIcon,
} from "../../assets/svg";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TTemplate, TTransactionType } from "../../types/transactionType";
import Swal from "sweetalert2";
import ReactTooltip from "react-tooltip";
import ActionButton from "../Generic/Button/ActionButton";
import SetTemplate from "../Template/SetTemplate";

const Templates: FC = observer(() => {
  const templates = store.transaction.templates;
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TTransactionType>();
  const [openedTemplate, setOpenedTemplate] = useState<TTemplate>();

  const openTemplate = (type: TTransactionType, template?: TTemplate) => {
    setOpenedTemplate(template);
    setTransactionType(type);
    setIsOpen(true);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Templates!!!</h1>
      <div className="flex gap-2">
        <ActionButton
          onClick={() => openTemplate("outcome")}
          color="red"
          active
        >
          <MinusIcon className="w-8 h-8" />
        </ActionButton>

        <ActionButton
          onClick={() => openTemplate("income")}
          color="green"
          active
        >
          <PlusIcon className="w-8 h-8" />
        </ActionButton>

        <ActionButton onClick={() => openTemplate("exchange")} active>
          <RepeatIcon className="w-8 h-8" />
        </ActionButton>
      </div>

      {templates.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Category</TH>
              <TH>Outcome</TH>
              <TH>Income</TH>
              <TH></TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {templates.map((template) => (
              <TemplateItem
                template={template}
                openModal={() => openTemplate(template.type, template)}
                key={template.id}
              />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTemplate
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        startTransactionType={transactionType}
        template={openedTemplate}
      />
    </>
  );
});

interface TemplateItemProps {
  template: TTemplate;
  openModal: () => void;
}

const TemplateItem: FC<TemplateItemProps> = observer(
  ({ template, openModal }) => {
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

    const confirmDelete = () => {
      Swal.fire({
        title: "Delete template",
        icon: "error",
        text: template.name,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          store.transaction.deleteTemplate(template.id);
        }
      });
    };

    return (
      <TR>
        <TD>{template.name}</TD>
        <TD className="text-center">{categoryName}</TD>

        {template.outcome && outcomeCurrency && outcomeAccount ? (
          <TD className="text-right">
            <div className="text-red-700">
              {getCurrencyValue(template.outcome.sum, outcomeCurrency)}
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
              {getCurrencyValue(template.income.sum, incomeCurrency)}
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

        <TDIcon>
          <button className="p-2" onClick={openModal}>
            <PencilIcon className="w-7 h-7" />
          </button>
        </TDIcon>
        <TDIcon>
          <button className="p-2" onClick={confirmDelete}>
            <TrashIcon className="w-7 h-7" />
          </button>
        </TDIcon>
      </TR>
    );
  }
);

export default Templates;
