import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../../components/navbar";
import MainTable from "./tableComponents/mainTable";
import SearchBox from "../lineage/components/search-box";
import OverlayContainer from "./tableComponents/overlay";

export default function NewTest() {
    const [toggleOverlay, setToggleOverlay] = useState(false);
    const theme = createTheme({
        palette: {
            primary: {
                main: "#a487ff",
            },
            secondary: {
                main: "#000000",
            },
            success: {
                main: "#6f47ef",
            },
            info: {
                main: "#c8c8c8",
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="h-screen w-full">
                <Navbar current="tests" jwt={undefined} />
                <div className="items-top relative flex h-20 justify-center">
                    <div className="relative mt-2 w-1/4">
                        <SearchBox
                            placeholder="Search..."
                            label="testsearchbox"
                            onChange={() => { }}
                        />
                    </div>
                </div>
                <MainTable
                    buttonOnClick={() => setToggleOverlay(!toggleOverlay)}
                    buttonText={"Tables"}
                    buttonIsDisclosure={false}
                    tableTitle="Schemas"
                    tableDescription="This is a test description."
                />
                {toggleOverlay && (
                    <OverlayContainer
                        content={
                            <MainTable
                                buttonOnClick={() => { }}
                                buttonText={"Columns"}
                                buttonIsDisclosure={true}
                                buttonDisclosureContent={
                                    <MainTable
                                        buttonOnClick={() => { }}
                                        buttonText={"Edit"}
                                        buttonIsDisclosure={false}
                                        darkMode={true}
                                    />
                                }
                                tableTitle="Tables"
                                tableDescription="This is a test description."
                            />
                        }
                        openState={[toggleOverlay, setToggleOverlay]}
                    />
                )}
            </div>
        </ThemeProvider >
    );
}
