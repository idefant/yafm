import { FC, useMemo } from 'react';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '#components/Dashboard';
import { HeaderInfo } from '#components/Header';
import { Card } from '#ui/Card';
import { DateFilter, useDateFilter } from '#ui/DateFilter';
import { Grid } from '#ui/Grid';
import { VStack } from '#ui/Stack';
import { Title } from '#ui/Typography';

const dateQuery = {
  month: 'YYYY-MM',
  year: 'YYYY',
};

export const Dashboard: FC = () => {
  const filterData = useDateFilter();
  const { date, periodType } = filterData;
  const { data: rates } = useFetchRatesByPeriodQuery({
    period: date.format(dateQuery[periodType]),
  });

  const datePeriod = useMemo(
    () => ({
      start: filterData.date.startOf(filterData.periodType),
      end: filterData.date.endOf(filterData.periodType),
    }),
    [filterData.date, filterData.periodType],
  );

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
              <DateFilter options={filterData} />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={9}>
          <VStack gap={16}>
            <DashboardBalanceHistoryChart filterData={filterData} rates={rates} />

            <Grid gap={16}>
              <Grid.Item size={6}>
                <DashboardCategoryChart
                  period={datePeriod}
                  rates={rates}
                  transactionType="income"
                />
              </Grid.Item>

              <Grid.Item size={6}>
                <DashboardCategoryChart
                  period={datePeriod}
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
