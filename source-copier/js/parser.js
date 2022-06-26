const utils = require('./utils');

function Parser(){
  this._log = [];
}

Parser.prototype.reset = function(){
    //delete all messages
    this._log.length = 0;
}

Parser.prototype.add_new_string_and_try_aggregate = function(s, cb_rejected){
  if (is_next(s)) {
    this.do_aggregate(cb_rejected);
  }
  this._log.push(s);
}

//@static (or not - look at @param log)
Parser.prototype.do_aggregate = function(cb_rejected, log){
  var agg;
  if (log) {
    agg = process(log);
  } else {
    agg = process(this._log);
    this.reset(); //delete all messages
  }
  
  if (agg.ok) {
    //log aggregated info
    utils.log(ff(agg.changed), agg.main_branch, agg.from, '---->', agg.to);
    if (agg.rejected.length) {
      if (typeof cb_rejected == 'function') {
        cb_rejected(agg);
      }
    }
  }
  return agg;
}




    function is_next(_){
      return (_.indexOf('--->') != -1);
    }

    function process(log_array){
      const status = {
        ok : false,
        error_unable_to_access_source_repo : true,
        error_unable_to_access_destination_repo : false,
        branches_changed : 0,
        branches_rejected : 0,
        rejected : [],
        main_branch : '-',
        from : '',
        to : ''
      }


      log_array = log_array.join("").split(/[\n\r]/g);
      log_array.forEach(_=>{
        processLine(_, status);
      })
/*
      //lines can contain several log strings separated with \n or \r
      log_array.forEach(_=>{
        _ = _.split(/[\n\r]/g);
        for (var i in _) processLine(_[i], status);
      })
*/
      return {
        ok : status.ok,
        main_branch : status.main_branch, 
        changed: (status.error_unable_to_access_source_repo ? 'x' :
                    (status.error_unable_to_access_destination_repo ? '?' :
                       ( (!status.branches_changed && !status.branches_rejected) ? '-' : status.branches_changed+'u' + (status.branches_rejected?status.branches_rejected+'r':''))
                    )
                 ),
        rejected : status.rejected,
        from : status.from, 
        to : status.to
      }
    }

    function processLine(_, status){
        //parse from and to
        if (_.indexOf('---->')!=-1) {
          var x = _.replace(/\n/g, '').split('---->');
          status.from = x[0].trim();
          status.to = x[1].trim();
        }

        //is it good log or something empty? 
        if (_.indexOf('Cloning into ')!=-1) status.ok = true;

        //check "unable to access" error (cannot access source or destination repo)
        if (_.indexOf('atal: unable to access')!=-1) status.error_unable_to_access_destination_repo = true;
        if (_.indexOf('atal: Authentication failed for')!=-1) status.error_unable_to_access_destination_repo = true;
        if (_.match(/atal: repository[\s]*[^\s]*[\s]*not found/gi)) status.error_unable_to_access_destination_repo = true;
        if (_.indexOf('atal: Could not read from remote')!=-1) status.error_unable_to_access_destination_repo = true;
        if (_.indexOf('epository not found')!=-1) status.error_unable_to_access_destination_repo = true;

//        if (_.indexOf('atal: Could not read from remote')!=-1) status.error_unable_to_access_source_repo = true;
//        if (_.indexOf('Repository not found')!=-1) status.error_unable_to_access_source_repo = true;
        if (_.indexOf('remote: Counting objects:')!=-1) status.error_unable_to_access_source_repo = false;
        if (_.indexOf('warning: You appear to have cloned an empty repository')!=-1) status.error_unable_to_access_source_repo = false;

        //find default branch
        var pos = _.toLowerCase().indexOf('atal: a branch named');
        if (pos !== -1 ) {
          let s = (_.substring(pos+20)).split('already exists')
          status.main_branch = s[0].replace(/\'/g, '').trim();
        }

        //count changed and rejected branches
        if (_.indexOf(' -> ')!=-1) {
          if (_.indexOf('[rejected]')!=-1) {
            status.branches_rejected++;

            var x = _.split('[rejected]')[1];
            x = x.split(' -> ')[0];
            x = x.trim();
            status.rejected.push(x);
          } else {
            status.branches_changed++;
          }
        }
    }

    function ff(s){
      s = '' + s;
      if (s.length < 1) return "     ";
      if (s.length < 2) return "    "+s;
      if (s.length < 3) return "   "+s;
      if (s.length < 4) return "  "+s;
      if (s.length < 5) return " "+s;
    }


module.exports = Parser;