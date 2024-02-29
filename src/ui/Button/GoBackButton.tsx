import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../Icon';

const GoBackButton: FC = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="absolute py-1 pl-0.5 pr-1.5 rounded-full transition-all hover:bg-slate-700"
      onClick={() => navigate(-1)}
      aria-label="go back"
    >
      <Icon.ChevronLeft className="w-8 h-8" />
    </button>
  );
};

export default GoBackButton;
