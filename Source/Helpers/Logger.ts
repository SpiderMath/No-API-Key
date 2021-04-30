import moment from "moment";
import { ConsoleColours } from "../Constants/ConsoleColours";

function CurrentLogTime() {
	return moment().format("dddd, MMMM Do YYYY, h:mm:ss A");
}

const Logger = {
	error: (name: string, output: string): void => console.log(`${ConsoleColours.red}${CurrentLogTime()} ${name}: ${ConsoleColours.reset}${output}`),
	warn: (name: string, output: string): void => console.log(`${ConsoleColours.yellow}${CurrentLogTime()} ${name}: ${ConsoleColours.reset}${output}`),
	info: (name: string, output: string): void => console.log(`${ConsoleColours.blue}${CurrentLogTime()} ${name}: ${ConsoleColours.reset}${output}`),
	success: (name: string, output: string): void => console.log(`${ConsoleColours.green}${CurrentLogTime()} ${name}: ${ConsoleColours.reset}${output}`),
};

export default Logger;