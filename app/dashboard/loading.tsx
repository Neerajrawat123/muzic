import { HashLoader } from "react-spinners";

export default function Loader({isLoading}: {isLoading: boolean}) {
  return (
    <HashLoader
      color={"#60B5FF"}
      loading={isLoading}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
