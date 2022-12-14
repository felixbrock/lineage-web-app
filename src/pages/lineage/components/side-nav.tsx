import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import { SiSnowflake } from 'react-icons/si';
import { ReactElement, useEffect, useState } from 'react';
import { EmptyStateDottedLine } from './empty-state';
import SearchBox from './search-box';
import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import { SelectedElement, SourceData } from './lineage-graph';
import ColumnDto from '../../../infrastructure/lineage-api/columns/column-dto';

const groupMatsByDbId = (
  acc: { [dbName: string]: MaterializationDto[] },
  el: MaterializationDto
) => {
  const localAcc = acc;

  if (el.databaseName in localAcc) localAcc[el.databaseName].push(el);
  else localAcc[el.databaseName] = [el];

  return localAcc;
};

const compareReactElements = (a: ReactElement, b:ReactElement) => {
    if(!a.key || !b.key) return 0;
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
}

export default ({
  sourceData,
  dataAvailable,
  navClickCallback,
  showIntegrationPanelCallback,
}: {
  sourceData?: SourceData;
  dataAvailable: boolean;
  navClickCallback: (selectedEl: SelectedElement, comboId?: string) => void;
  showIntegrationPanelCallback: (show: boolean) => void;
}): ReactElement => {
  const [allSideNavMatElements, setAllSideNavMatElements] = useState<
    ReactElement[]
  >([]);
  const [searchedSideNavMatElements, setSearchedSideNavMatElements] = useState<
    ReactElement[]
  >([]);
  const [SideNavMatElements, setSideNavMatElements] = useState<ReactElement[]>(
    []
  );

  const handleNavMatClickEvent = (
    event: React.SyntheticEvent,
    matId: string
  ) => {
    navClickCallback({ id: matId, type: 'combo' });
  };

  const handleNavColClickEvent = (
    event: React.SyntheticEvent,
    colId: string,
    comboId: string
  ) => {
    navClickCallback({ id: colId, type: 'node' }, comboId);
  };

  const handleSearchChange = (event: any) => {
    throw new Error('Not implemented');

    if (!allSideNavMatElements) return;

    const value = event.target.value;
    if (!value) {
      setSearchedSideNavMatElements([]);
      setSideNavMatElements(allSideNavMatElements);
      return;
    }

    const isReactElement = (element: any): element is ReactElement => !!element;

    const populationToSearch = allSideNavMatElements;

    const newSideNavMatElements = populationToSearch
      .map((element: ReactElement) => {
        if (new RegExp(value, 'gi').test(element.props.label)) return element;
      })
      .filter(isReactElement);

    // todo create db overview

    setSearchedSideNavMatElements(newSideNavMatElements);
  };

  const buildSideNavColElement = (col: ColumnDto) => {
    return (
      <ListItem key={`col-item-${col.name}`} dense={true}>
        <ListItemButton
          onClick={(e) => handleNavColClickEvent(e, col.id, col.materializationId)}
          dense={true}
          key={`list-item-col-${col.id}`}
        >
          <ListItemIcon>
            <CircleTwoToneIcon fontSize="small" sx={{ color: '#674BCE' }} />
          </ListItemIcon>
          <ListItemText primary={col.name} secondary= {`${col.isIdentity ? `🆔`: ''} type: ${col.dataType}`} />
        </ListItemButton>
      </ListItem>
    );
  };

  const buildSideNavMatElement = (mat: MaterializationDto): ReactElement => {
    if (!sourceData)
      throw new Error('Cannot build side nav elements - Source data missing');

    const colElements = sourceData.cols
      .filter((el) => el.materializationId === mat.id)
      .map((el) => buildSideNavColElement(el)).sort(compareReactElements);

    return (
      <div key={`mat-item-${mat.name}`}>
        <ListItem key={mat.id} dense={true}>
          <ListItemButton
            onClick={(e) => handleNavMatClickEvent(e, mat.id)}
            dense={true}
            key={`list-item-mat-${mat.id}`}
          >
            <ListItemIcon>
              <SiSnowflake />
            </ListItemIcon>
            <ListItemText primary={mat.name} />
          </ListItemButton>
        </ListItem>
        {colElements}
      </div>
    );
  };

  const buildSideNavElements = (): ReactElement[] => {
    if (!sourceData) throw new Error('Missing source data');

    const matsByDb = sourceData.mats.reduce(groupMatsByDbId, {});

    const dbElements = Object.entries(matsByDb).map((entry) => {
      const key = entry[0];
      const val = entry[1];

      const dbElement = <ListSubheader>{key}</ListSubheader>;

      const matElements = val.map((el) => buildSideNavMatElement(el)).sort(compareReactElements);

      return (
        <li key={`section-${key}`}>
          <ul>
            {dbElement}
            {matElements}
          </ul>
        </li>
      );
    }).sort(compareReactElements);

    return dbElements;
  };

  useEffect(() => {
    if (!sourceData) return;

    const elements = buildSideNavElements();
    setAllSideNavMatElements(elements);
    setSideNavMatElements(elements);
  }, [sourceData]);

  useEffect(() => {
    if (!searchedSideNavMatElements.length) return;

    setSideNavMatElements(searchedSideNavMatElements);
  }, [searchedSideNavMatElements]);

  return (
    <div id="sidenav" className="sidenav">
      <div className="mx-4">
        <SearchBox
          placeholder="Search..."
          label="leftsearchbox"
          onChange={handleSearchChange}
        />
      </div>
      {/* <div className="mb-4 flex justify-center gap-x-6">
            <ButtonSmall
              buttonText={
                expandedSideNavMatElementIds.length === 0
                  ? 'Expand All'
                  : 'Collapse All'
              }
              onClick={handleSideNavMatExpandClick}
            />
            <ButtonSmall
              buttonText="Filter Anomalies"
              onClick={handleFilterAnomalies}
              className="hidden"
            />
          </div> */}
      <div id="content">
        {dataAvailable ? (
          <List
            sx={{
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {SideNavMatElements}
          </List>
        ) : (
          <EmptyStateDottedLine
            onClick={() => showIntegrationPanelCallback(true)}
          />
        )}
      </div>
    </div>
  );
};
