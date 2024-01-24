import { useCallback, useState } from "react";
import { shorten } from "../../src/api";
import { Box, Button, Input, Link, Stack } from "@mui/material";
import { isValidUrl } from "../../src/utils";
import { UrlItem } from "../../src/interfaces";
import Snackbar from "@mui/material/Snackbar";

export default function Shortener() {
  const [url, setUrl] = useState<string>("");
  const [shortUrls, setShortUrls] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(
    undefined
  );

  const apiDomain = import.meta.env.VITE_API_URL;
  const handleSubmit = useCallback(
    (event: any) => {
      event.preventDefault();
      shorten({ url })
        .then((result) => {
          const urlItem: UrlItem = result?.data;
          const shortUrl = `${apiDomain}${urlItem.key}`;
          setShortUrls([shortUrl, ...shortUrls]);
        })
        .catch(({ response }) => {
          setOpenSnackbar(true);
          setSnackbarMessage(response?.data?.message);
        });
    },
    [url]
  );

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage(undefined);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Input
          fullWidth={true}
          value={url}
          onChange={(event) => {
            setUrl(event?.target?.value?.trim()?.toLowerCase());
          }}
        />
        <Button
          style={{ marginTop: 20 }}
          variant="contained"
          type={"submit"}
          disabled={!isValidUrl(url)}
        >
          Shorten
        </Button>
        {shortUrls?.length > 0 && (
          <Stack marginTop={5} border={"1px solid gray"} padding={2}>
            {shortUrls.map((v: string, i: number) => (
              <Box marginBottom={2} key={i}>
                <Link target="_blank" href={v}>
                  {v}
                </Link>
              </Box>
            ))}
          </Stack>
        )}
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message={snackbarMessage}
      />
    </>
  );
}
