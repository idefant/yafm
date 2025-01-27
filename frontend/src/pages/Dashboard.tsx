import { FC } from 'react';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '#components/Dashboard';
import { HeaderInfo } from '#components/Header';
import { Card } from '#ui/Card';
import DateFilter, { useDateFilter } from '#ui/DateFilter';
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

      <Card>
        <Card.Content>
          <Title level={4} gutterBottom>
            Data Filter
          </Title>
          <DateFilter options={filterData} />
        </Card.Content>
      </Card>

      <DashboardBalanceHistoryChart filterData={filterData} rates={rates} />

      <DashboardCategoryChart filterData={filterData} rates={rates} />
    </>
  );
};

export default Dashboard;
