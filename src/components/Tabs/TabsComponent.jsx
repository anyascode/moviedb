import { Tabs } from 'antd';

const items = [
  {
    key: '1',
    label: 'Search',
  },
  {
    key: '2',
    label: 'Rated',
  },
];

function TabsComponent({ onTabChange }) {
  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      onChange={(key) => onTabChange(key === '1' ? 'Search' : 'Rated')}
      centered
      destroyInactiveTabPane={false}
    />
  );
}
export default TabsComponent;
