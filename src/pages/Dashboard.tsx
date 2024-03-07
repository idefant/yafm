import { FC } from 'react';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '#components/Dashboard';
import Card from '#ui/Card';
import DateFilter, { useDateFilter } from '#ui/DateFilter';
import { Title } from '#ui/Title';

const dateQuery = {
  month: 'YYYY-MM',
  year: 'YYYY',
};

const Dashboard: FC = () => {
  const filterData = useDateFilter();
  const { date, periodType } = filterData;
  const { data: rates } = useFetchRatesByPeriodQuery(date.format(dateQuery[periodType]));

  return (
    <>
      <Title>Dashboard</Title>

      <Card>
        <Card.Header>Data Filter</Card.Header>
        <Card.Body>
          <DateFilter options={filterData} />
        </Card.Body>
      </Card>

      <DashboardBalanceHistoryChart filterData={filterData} rates={rates} />

      <DashboardCategoryChart filterData={filterData} rates={rates} />
    </>
  );
};

export default Dashboard;
