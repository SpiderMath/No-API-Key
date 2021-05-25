import { Request, Router, Response } from "express";

// @ts-ignore
function match(subdomains, offset) {
	// @ts-ignore
	return function(item, index) {
	  return (item === "*" && !!subdomains[index + offset])
		|| subdomains[index + offset] === item;
	};
}

/**
   * Subdomain router
   *
   * @param {String} subdomain
   * @param {Function} fn, middleware, router
   * @return {Function} middleware
   */

export default function(subdomain: string, fn: Router) {
	return function(req: Request, res: Response, next: any) {

	  // keep track of matched subdomains (allows nested router)
	  // @ts-ignore
	  req._subdomainsMatched = req._subdomainsMatched || 0;

	  const parts = subdomain.split(".").reverse();

	  // route
		// @ts-ignore
		if (parts.every(match(req.subdomains, req._subdomainsMatched))) {
			// @ts-ignore
			req._subdomainsMatched += parts.length;
			return fn(req, res, next);
	  }
		else {
			next();
	  }
	};
};