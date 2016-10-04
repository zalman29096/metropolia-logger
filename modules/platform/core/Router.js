class Router{
	constructor(){
		this.customRoutes = __CONFIG.routes;
	}

	getRoute(req){
		var pathRaw = req.params[0];

		if(this.customRoutes.paths.hasOwnProperty(pathRaw)){
			Log.info("Custom route '{}' found for request '{}'", this.customRoutes.paths[pathRaw], pathRaw);
			pathRaw = this.customRoutes.paths[pathRaw];
		}
		var pathMap = this._prepare_path_map(pathRaw, "/");
		if(pathMap.length <= 0 ){
			Log.error("Can't prepare map for path {}", pathRaw);
			return false;
		}
		var retval = {
			module : "",
			action : "",
			params : []
		};

		retval.module = pathMap[0];
		retval.action = pathMap[1] || "index";
		
		if(pathMap.length > 2){
			pathMap.splice(0, 2);
			retval.params = pathMap.slice();
		}
		if(this.customRoutes.static.indexOf(retval.module) >= 0){
			var filepath = __CONFIG.paths.publicDir + pathRaw;
			return {static : true, path : filepath};
		}

		return retval;

	}

	_prepare_path_map(path, delimiter){
		var _map = path.split(delimiter);
		_map = _map.filter(function(_m_elem){ return (_m_elem && _m_elem != "")});
		_map = _map.map((_m_elem) => { return _m_elem.replace(/\s/, "")});
		return _map;
	}
}

module.exports = function(){
	return new Router();
}
