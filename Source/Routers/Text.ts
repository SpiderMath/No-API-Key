import { Router } from "express";
import RouterExport from "../Constants/Router";
import NotProvided from "../Helpers/NotProvided";

const TextRouter = Router();

/**
 * @swagger
 * /b1ff:
 *   get:
 *     description: Transforms text to B1FF talk
 *     parameters:
 *       name: text
 *       description: The text you want to convert
 *       required: true
 *       in: query
 *       type: string
 *     tags: [Text]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
TextRouter
	.get("/b1ff", (req, res) => {
		// @ts-ignore
		let text: string = req.query.text;

		if(!text) return res.status(400).send({ error: NotProvided("text") });

		function getRandFn(initialSeed = 1) {
			let curSeed = initialSeed;
			return function rand() {
			  curSeed = (curSeed * 48271) % 0x7fffffff;
			  return curSeed;
			};
		};

		const rand = getRandFn();
		text = text
			.split("\n")
			.map((line: string) => {
				return (
					line
						.toUpperCase()
						.replace(/;/g, ",")
						.replace(/'/g, "")
						.replace(/\bEVERYONE\b/g, "EVRY 1")
						.replace(/\bEVERYBODY\b/g, "EVRY BUDY")
						.replace(/\bEVERY\b/g, "EVRY")
						.replace(/\bONE\b/g, "1")
						.replace(/\bAND\b/g, "+")
						.replace(/\bYOU/g, "U")
						.replace(/\bITS\b/g, "IT\"S")
						.replace(/\bIT\'S\b/g, "ITS")
						.replace(/\bIS\b/g, "IZ")
						.replace(/\bLINUX\b/g, "LINUS")
						.replace(/\bUNIX\b/g, "THE MANEFRA1M O/S")
						.replace(/\bWINDOWS\b/g, "WINDOWZ (IT RULEZ MAN!)")
						.replace(/\bYOU\'RE\b/g, "YOUR")
						.replace(/\bTHEM\b/g, "THUM")
						.replace(/\bTHEY\'RE\b/g, "THE1R")
						.replace(/\bTHEIR\b/g, "THERE")
						.replace(/\bWAS\b/g, "WUZ")
						.replace(/\bMACINTOSH\b/g, "IMAC")
						.replace(/\bVERY\b/g, "TOTALLY")
						.replace(/\bCOMPUTER\b/g, "VIC-20")
						.replace(/\bWHETHER\b/g, "WHETHUR")
						.replace(/\b(?:H|CR)ACKER\b/g, "KEWL HACKER D00D!")
						.replace(/\bOF\b/g, "UV")
						.replace(/\bGNU\b/g, "NEW")
						.replace(/\bQUITE\b/g, "REAL")
						.replace(/\bFREE\b/g, "FREE!")
						.replace(/HOME/g, "HUM")
						.replace(/COME/g, "CUM")
						.replace(/MICRO/g, "MIKRO")
						.replace(/GOVERN/g, "GUVERN")
						.replace(/PERSON/g, "D00D")
						.replace(/SOME/g, "SUM")
						.replace(/WRITE/g, "RITE")
						.replace(/REAL/g, "REEL")
						.replace(/LITE/g, "L1TE")
						.replace(/BIAN/g, "B1AN")
						.replace(/TION/g, "SHUN")
						.replace(/FOR(R|E\b)?/g, "4")
						.replace(/\bTO(?=\b|NIGHT|NITE|DAY|MORROW|GETHER|WARD|MATO)/g, "2")
						.replace(/TOO/g, "2")
						.replace(/ATE/g, "8")
						.replace(/LL/g, "L")
						.replace(/OO/g, "00")
						.replace(/MATE/g, "M8")
						.replace(/ER/g, "UR")
						.replace(/S+\b/g, "Z")
						.replace(/KN/g, "N")
						.replace(/IE/g, "EI")
						.replace(/\.  /g, ". ")
						// @ts-ignore
						.replace(/\./g, () => {
					  switch (rand() % 3) {
							case 0:
						  return ".";
							case 1:
						  return "!";
							case 2:
						  return ",";
					  }
						})
						.replace(/!+/g, (match) => {
					  let ret = match + "!";
					  const length = rand() % 5;
					  let prevWasMangled = false;
					  for (let i = 0; i < length; i++) {
								// b1ff can't hold down on shift too well!!!!!!!1!
								if (!prevWasMangled && rand() % 3 === 2) {
						  ret = ret + "1";
						  prevWasMangled = true;
								}
								else {
						  ret = ret + "!";
						  prevWasMangled = false;
								}
					  }
					  return ret;
						})
						.replace(/\?+/g, (match) => {
					  let ret = "";
					  const length = (rand() % 5) + 1;
					  let prevWasMangled = false;
					  while (ret.length < length) {
								if (!prevWasMangled && rand() % 5 > 2) {
						  ret = ret + "?!";
						  prevWasMangled = true;
								}
								else if (!prevWasMangled && rand() % 5 > 3) {
						  ret = ret + "?1";
						  prevWasMangled = true;
								}
								else {
						  ret = ret + "?";
						  prevWasMangled = false;
								}
					  }
					  return match + ret;
						})
						.replace(/I/g, () => (rand() % 3 > 2 ? "1" : "I"))
				);
			})
			.join("\n");
		return res.status(200).send({ response: text });
	});

const configuration: RouterExport = {
	name: "text",
	router: TextRouter,
};

export default configuration;