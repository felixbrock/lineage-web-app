import { useEffect, useState } from "react";

function useData(url: any) {

    const respObject = {
        loading: true,
        payload: {},
    }

    const [data, setData] = useState(respObject);

    useEffect(() => {
        let ignore = false;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setData({ loading: false, payload: json });
                }
            });
        return () => {
            ignore = true;
        };
    }, [url]);

    return data;
}

function useSessionStorageData() {

    const sessionStorageLineage = sessionStorage.getItem('lineage');
    if (!sessionStorageLineage) return undefined;

    const sessionStorageMats = sessionStorage.getItem('mats');
    const sessionStorageCols = sessionStorage.getItem('cols');

    return {
        lineage: JSON.parse(sessionStorageLineage),
        mats: sessionStorageMats ? JSON.parse(sessionStorageMats) : [],
        cols: sessionStorageCols ? JSON.parse(sessionStorageCols) : [],
    };
};

export function useTestData() {
    const apiEndpoint = "https://jsonplaceholder.typicode.com/todos/1"
    const testData = useData(apiEndpoint);

    if (!testData.loading) return buildTestDataFromSource(testData)

    return testData
}

function buildTestDataFromSource(testData: any) {
    return { test: true }
}
