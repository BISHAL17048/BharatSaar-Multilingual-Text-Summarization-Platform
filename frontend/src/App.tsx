import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { HistoryProvider } from "./contexts/HistoryContext";

function App() {
  return (
    <HistoryProvider>
      <RouterProvider router={router} />
    </HistoryProvider>
  );
}

export default App;
