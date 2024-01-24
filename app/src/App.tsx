import Shortener from "../components/shortener";
import { Typography } from "@mui/material";

function App() {
  return (
    <main style={{ height: "100vh", backgroundColor: "azure" }}>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant={"h3"}
          style={{ marginTop: "50px", marginBottom: "100px" }}
        >
          URL shortener
        </Typography>
        <Shortener />
      </section>
    </main>
  );
}

export default App;
