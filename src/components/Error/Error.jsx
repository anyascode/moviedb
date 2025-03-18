import { Alert } from 'antd';
import './Error.css';

function Error() {
  return (
    <div className="error-message">
      <Alert message="Oops!" description="Issue occured while fetching data" type="error" showIcon />
    </div>
  );
}

export default Error;
