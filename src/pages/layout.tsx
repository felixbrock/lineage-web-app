import { useContext } from 'react';
import Navbar from '../components/navbar';
import {
  LeftPanelContext,
  RightPanelContext,
} from '../components/panelContext';
import Sidepanel from '../components/sidepanel';
import LineageCopy from './lineage/lineageCopy';

export default function Layout({ content }: any) {
  const leftPanelContext = useContext(LeftPanelContext);
  const rightPanelContext = useContext(RightPanelContext);

  return (
    <div className="flex flex-col">
      <Navbar
        current="lineage"
        toggleLeftPanel={() => {}}
        toggleRightPanelFunctions={{ open: () => {}, close: () => {} }}
        isRightPanelShown={true}
        setIsRightPanelShown={() => {}}
      />
      <Sidepanel isRight={false} panelContext={leftPanelContext} />
      <Sidepanel isRight={true} panelContext={rightPanelContext} />
      <div className="absolute inset-x-0 top-16 bottom-0 z-30 bg-gray-700">
        <div className="h-full w-full"><LineageCopy /> {content}</div>
      </div>
    </div>
  );
}
