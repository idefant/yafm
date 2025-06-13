import { FC } from 'react';

import { HeaderInfo } from '#components/Header';
import { useAppSelector } from '#hooks/reduxHooks';
import { Card } from '#ui/Card';
import { Title } from '#ui/Typography';

export const Commits: FC = () => {
  const commits = useAppSelector((state) => state.commits.commits);

  return (
    <>
      <HeaderInfo title="Commits" />

      <Card>
        <Card.Content>
          <Title level={4} gutterBottom>
            Commits
          </Title>

          <pre style={{ userSelect: 'text' }}>{JSON.stringify(commits, null, 4)}</pre>
        </Card.Content>
      </Card>
    </>
  );
};
