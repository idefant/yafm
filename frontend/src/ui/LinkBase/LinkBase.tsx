import { ComponentProps, FC } from 'react';
import { Link } from 'react-router-dom';

interface LinkBaseProps extends ComponentProps<typeof Link> {}

export const LinkBase: FC<LinkBaseProps> = ({ to, children, ...props }) => {
  if (typeof to === 'string' && (to.startsWith('http://') || to.startsWith('https://'))) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};
