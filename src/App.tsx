import { SimpleTable } from "./components/SimpleTable";
import dataApi from './Data.json'
export const App = () => {

  return (
    <div>
      <SimpleTable  data={dataApi} />
    </div>
  );
};
