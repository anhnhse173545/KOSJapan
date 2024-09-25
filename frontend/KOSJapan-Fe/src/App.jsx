import Footer from "./component/Footer/Footer";
import Header from "./component/Header/Header";
import TaskManagerment from "./component/TaskManagerment/TaskManagerment";

function App() {
  return (
    <>
      <Header />
      <main>
        <h1>Welcom</h1>
        <TaskManagerment />
      </main>

      <Footer />
    </>
  );
}

export default App;
