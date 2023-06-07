import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { CustomTestSuiteDto } from '../../../infrastructure/observability-api/test-suite-dto';
import { classNames } from '../../test/utils/tailwind';
import ObservabilityApiRepo from '../../../infrastructure/observability-api/observability-api-repo';

const buttonColorOn = 'bg-green-600';
const buttonColorOff = 'bg-gray-200';

export default function Toggle({
  test
}: {
  test: CustomTestSuiteDto;
}) {

  const { id, activated } = test;
  const [enabled, setEnabled] = useState(activated);

  function getColor() {
    const color = enabled ? buttonColorOn : buttonColorOff 
    return color;
  }

  useEffect(() => {
    setEnabled(activated);
  }, [activated]);

  async function toggleSwitch() {

    await ObservabilityApiRepo.updateCustomTestSuite({
      id: test.id,
      props: {
        activated: !test.activated
      }
    });

    test.activated = !test.activated;
    setEnabled(!enabled);
  }

  return (
    <Switch.Group as="div" className="flex items-center pr-2">
      <Switch
        checked={enabled}
        disabled={id.includes('TEMP_ID')}
        onChange={toggleSwitch}
        className={classNames(
          getColor(),
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}