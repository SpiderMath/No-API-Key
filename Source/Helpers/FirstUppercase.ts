export default function FirstUppercase(string: string) {
	return string.split(" ").map(str => str.split("")[0].toUpperCase() + str.split("").slice(1).join("")).join(" ");
}