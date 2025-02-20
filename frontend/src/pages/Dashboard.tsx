import { FC } from 'react';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '#components/Dashboard';
import { HeaderInfo } from '#components/Header';
import { Card } from '#ui/Card';
import { DateFilter, useDateFilter } from '#ui/DateFilter';
import { Grid } from '#ui/Grid';
import { VStack } from '#ui/Stack';
import { Title } from '#ui/Typography';

export const Dashboard: FC = () => {
  const dateFilter = useDateFilter();

  const { data: rates } = useFetchRatesByPeriodQuery({ period: dateFilter.period.formatted });

  return (
    <>
      <HeaderInfo title="Dashboard" />

      <Grid gap={16} reversed>
        <Grid.Item size={3}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Filter
              </Title>
              <DateFilter options={dateFilter} />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={9}>
          <VStack gap={16}>
            <DashboardBalanceHistoryChart period={dateFilter.period} rates={rates} />

            <Grid gap={16}>
              <Grid.Item size={6}>
                <DashboardCategoryChart
                  period={dateFilter.period}
                  rates={rates}
                  transactionType="income"
                />
              </Grid.Item>

              <Grid.Item size={6}>
                <DashboardCategoryChart
                  period={dateFilter.period}
                  rates={rates}
                  transactionType="outcome"
                />
              </Grid.Item>
            </Grid>
          </VStack>
        </Grid.Item>
      </Grid>
    </>
  );
};
