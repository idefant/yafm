import { FC } from 'react';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '#components/Dashboard';
import { HeaderInfo } from '#components/Header';
import { Card } from '#ui/Card';
import DateFilter, { useDateFilter } from '#ui/DateFilter';
import { Grid } from '#ui/Grid';
import { VStack } from '#ui/Stack';
import { Title } from '#ui/Typography';

const dateQuery = {
  month: 'YYYY-MM',
  year: 'YYYY',
};

const Dashboard: FC = () => {
  const filterData = useDateFilter();
  const { date, periodType } = filterData;
  const { data: rates } = useFetchRatesByPeriodQuery({
    period: date.format(dateQuery[periodType]),
  });

  return (
    <>
      <HeaderInfo title="Dashboard" />

      <Grid gap={16} reversed>
        <Grid.Item size={3}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Data Filter
              </Title>
              <DateFilter options={filterData} />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={9}>
          <VStack gap={16}>
            <DashboardBalanceHistoryChart filterData={filterData} rates={rates} />
            <DashboardCategoryChart filterData={filterData} rates={rates} />
          </VStack>
        </Grid.Item>
      </Grid>
    </>
  );
};

export default Dashboard;
