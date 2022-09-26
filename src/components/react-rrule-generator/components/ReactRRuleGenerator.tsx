export default () => 1;
// import { Component, PureComponent } from 'react';

// import Start from './Start/index';
// import Repeat from './Repeat/index';
// import End from './End/index';
// import computeRRuleToString from '../utils/computeRRule/toString/computeRRule';
// import computeRRuleFromString from '../utils/computeRRule/fromString/computeRRule';
// import configureInitialState from '../utils/configureInitialState';
// import translateLabel from '../utils/translateLabel';
// import '../styles/index.css';
// import translations from '../translations';

// type Frequency = 'Yearly' | 'Monthly' | 'Weekly' | 'Daily' | 'Hourly';
// type EndValue = 'Never' | 'After' | 'On date';

// interface Props {
//   id: string;
//   config: {
//     frequency: Frequency[];
//     yearly: 'on' | 'on the';
//     monthly: 'on' | 'on the';
//     end: EndValue[];
//     hideStart: boolean;
//     hideEnd: boolean;
//     hideError: boolean;
//     weekStartsOnSunday: boolean;
//   };
//   value: string;
//   onChange: (event: any) => any;
//   calendarComponent: new () => Component<any, any>;
//   translations: any;
// }
// class ReactRRuleGenerator extends PureComponent<Props> {
//   // compute default view based on user's config
//   state = configureInitialState(
//     this.props.calendarComponent,
//     this.props.id,
//     this.props.config
//   );

//   defaultProps = {
//     id: null,
//     value: '',
//     config: undefined,
//     onChange: undefined,
//     calendarComponent: undefined,
//     translations: translations.english,
//   };

//   public componentWillMount() {
//     if (this.props.onChange === this.defaultProps.onChange) {
//       // no onChange() was provided
//       throw new Error(
//         'No onChange() function has been passed to RRuleGenerator. \n' +
//           "Please provide one, it's needed to handle generated value."
//       );
//     }

//     if (this.props.value) {
//       // if value is provided to RRuleGenerator, it's used to compute state of component's forms
//       const data = computeRRuleFromString(this.state.data, this.props.value);
//       this.setState({ data });
//     }
//   }

//   public componentWillReceiveProps(nextProps: any) {
//     if (nextProps.value) {
//       const data = computeRRuleFromString(this.state.data, nextProps.value);
//       this.setState({ data });
//     }
//   }

//   setObjectValue = (
//     o: { [key: string]: any },
//     path: string,
//     value: string
//   ): any => {
//     let localObj = o;

//     try {
//       path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
//       path = path.replace(/^\./, ''); // strip a leading dot
//       const pathElements = path.split('.');
//       pathElements.forEach((val, i) => {
//         if (i < pathElements.length - 1 && val in localObj) {
//           localObj = localObj[val];
//         } else {
//           return;
//         }
//       });
//       localObj[pathElements[pathElements.length - 1]] = value;
//       return localObj;
//     } catch (error: any) {
//       throw new Error(error);
//     }
//   };

//   handleChange = ({ target }: { target: any }) => {
//     const newData = JSON.parse(JSON.stringify(this.state.data));
//     this.setObjectValue(newData, target.name, target.value);
//     const rrule = computeRRuleToString(newData);

//     this.setState({ data: newData });
//     this.props.onChange(rrule);
//   };

//   public render() {
//     const {
//       id,
//       data: { start, repeat, end, options, error },
//     } = this.state;

//     return (
//       <div>
//         {!options.hideError && error && (
//           <div className="alert alert-danger">
//             {translateLabel(this.props.translations, 'invalid_rrule', {
//               value: error,
//             })}
//           </div>
//         )}

//         <div className="px-0 pt-3 border rounded">
//           {!options.hideStart && (
//             <div>
//               <Start
//                 id={`${id}-start`}
//                 start={start}
//                 handleChange={this.handleChange}
//                 translations={this.props.translations}
//               />
//               <hr />
//             </div>
//           )}

//           <div>
//             <Repeat
//               id={`${id}-repeat`}
//               repeat={repeat}
//               handleChange={this.handleChange}
//               translations={this.props.translations}
//             />
//           </div>

//           {!options.hideEnd && (
//             <div>
//               <hr />
//               <End
//                 id={`${id}-end`}
//                 end={end}
//                 handleChange={this.handleChange}
//                 translations={this.props.translations}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default ReactRRuleGenerator;
