/*
@license

dhtmlxGantt v.3.1.0 Stardard
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt.config.highlight_critical_path = false;
gantt._criticalPathHandler = function(){
  console.log('_criticalPathHandler?')
  if(gantt.config.highlight_critical_path)
    gantt.render();
};
gantt.attachEvent("onAfterLinkAdd", gantt._criticalPathHandler);
gantt.attachEvent("onAfterLinkUpdate", gantt._criticalPathHandler);
gantt.attachEvent("onAfterLinkDelete", gantt._criticalPathHandler);
gantt.attachEvent("onAfterTaskAdd", gantt._criticalPathHandler);
gantt.attachEvent("onAfterTaskUpdate", gantt._criticalPathHandler);
gantt.attachEvent("onAfterTaskDelete", gantt._criticalPathHandler);


gantt.isCriticalTask = function (task) {
  console.log('iscrittask?')
  if(this._isTask(task)){
    if(this._isProjectEnd(task)){
      return true;
    }else{
      var successors = this._getSuccessors(task);
      for(var i=0; i < successors.length; i++){
        var next = this.getTask(successors[i].task);
        if(this._getSlack(task, next, successors[i].link) <= 0 && this.isCriticalTask(next))
          return true;
      }
    }
  }
  return false;
};

gantt.isCriticalLink = function (link) {
  console.log('isCriticalLink?')
  return this.isCriticalTask(gantt.getTask(link.source));
};

gantt.getSlack = function(task1, task2){
  console.log('getSlack?')
  var relations = [];
  var common = {};
  for(var i=0; i < task1.$source.length; i++){
    common[task1.$source[i]] = true;
  }
  for(var i=0; i < task2.$target.length; i++){
    if(common[task2.$target[i]])
      relations.push(task2.$target[i]);
  }

  var slacks = [];
  for(var i=0; i < relations.length; i++){
    slacks.push(this._getSlack(task1, task2, this.getLink(relations[i]).type));
  }

  return Math.min.apply(Math, slacks);
};

gantt._getSlack = function (task, next_task, relation) {
  if(relation === null) return 0;
  var from = null,
    to = null;
  var links = this.config.links,
    types = this.config.types;

  if((relation == links.finish_to_finish || relation == links.finish_to_start) && this._get_safe_type(task.type) != types.milestone){
    from = task.end_date;
  }else{
    from = task.start_date;
  }
  if((relation == links.finish_to_finish || relation == links.start_to_finish) && this._get_safe_type(next_task.type) != types.milestone){
    to = next_task.end_date;
  }else{
    to = next_task.start_date;
  }
  return this.calculateDuration(from, to);
};

gantt._getProjectEnd = function () {
  var tasks = gantt.getTaskByTime();
  tasks = tasks.sort(function (a, b) { return +a.end_date > +b.end_date ? 1 : -1; });
  return tasks.length ? tasks[tasks.length - 1].end_date : null;
};

gantt._isProjectEnd = function (task) {
  return !(this.calculateDuration(task.end_date, this._getProjectEnd()));
};

gantt._isTask = function (task) {
  return (!task.type || task.type != gantt.config.types.project) && !(task.$no_start || task.$no_end);
};

gantt._isProject = function (task) {
  return !this._isTask(task);
};
gantt._formatSuccessors = function(ids, link_type){
  var res = [];
  for(var i = 0; i < ids.length; i++){
    res.push(this._formatSuccessor(ids[i], link_type));
  }
  return res;
};
gantt._formatSuccessor = function(id, link_type){
  return {task:id, link:link_type};
};
gantt._getSuccessors = function (task) {
  var successors = [];
  if (gantt._isProject(task)) {
    successors = successors.concat(gantt._formatSuccessors(gantt._branches[task.id] || [], null));
  } else {
    var links = task.$source;
    for (var i = 0; i < links.length; i++) {
      var link = this.getLink(links[i]);
      var target = this.getTask(link.target);
      if(this._isTask(target)){
        successors.push(gantt._formatSuccessor(link.target, link.type));
      }else{
        successors = successors.concat(gantt._formatSuccessors(gantt._branches[target.id] || [], link.type));
      }
    }
  }
  return successors;
};


// /*
// @license

// dhtmlxGantt v.3.1.0 Stardard
// This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

// (c) Dinamenta, UAB.
// */
// gantt.config.highlight_critical_path = !1, gantt._criticalPathHandler = function() {
//   gantt.config.highlight_critical_path && gantt.render()
// }, gantt.attachEvent("onAfterLinkAdd", gantt._criticalPathHandler), gantt.attachEvent("onAfterLinkUpdate", gantt._criticalPathHandler), gantt.attachEvent("onAfterLinkDelete", gantt._criticalPathHandler), gantt.attachEvent("onAfterTaskAdd", gantt._criticalPathHandler), gantt.attachEvent("onAfterTaskUpdate", gantt._criticalPathHandler), gantt.attachEvent("onAfterTaskDelete", gantt._criticalPathHandler), gantt.isCriticalTask = function(t) {
//   console.log('crit path ? ');
//   if (this._isTask(t)) {
//     if (this._isProjectEnd(t)) return !0;
//     for (var n = this._getSuccessors(t), a = 0; a < n.length; a++) {
//       var e = this.getTask(n[a].task);
//       if (this._getSlack(t, e, n[a].link) <= 0 && this.isCriticalTask(e)) return !0
//     }
//   }
//   return !1
// }, gantt.isCriticalLink = function(t) {
//   return this.isCriticalTask(gantt.getTask(t.source))
// }, gantt.getSlack = function(t, n) {
//   for (var a = [], e = {}, i = 0; i < t.$source.length; i++) e[t.$source[i]] = !0;
//   for (var i = 0; i < n.$target.length; i++) e[n.$target[i]] && a.push(n.$target[i]);
//   for (var r = [], i = 0; i < a.length; i++) r.push(this._getSlack(t, n, this.getLink(a[i]).type));
//   return Math.min.apply(Math, r)
// }, gantt._getSlack = function(t, n, a) {
//   if (null === a) return 0;
//   var e = null,
//     i = null,
//     r = this.config.links,
//     s = this.config.types;
//   return e = a != r.finish_to_finish && a != r.finish_to_start || this._get_safe_type(t.type) == s.milestone ? t.start_date : t.end_date, i = a != r.finish_to_finish && a != r.start_to_finish || this._get_safe_type(n.type) == s.milestone ? n.start_date : n.end_date, this.calculateDuration(e, i)
// }, gantt._getProjectEnd = function() {
//   var t = gantt.getTaskByTime();
//   return t = t.sort(function(t, n) {
//     return +t.end_date > +n.end_date ? 1 : -1
//   }), t.length ? t[t.length - 1].end_date : null
// }, gantt._isProjectEnd = function(t) {
//   return !this.calculateDuration(t.end_date, this._getProjectEnd())
// }, gantt._isTask = function(t) {
//   return !(t.type && t.type == gantt.config.types.project || t.$no_start || t.$no_end)
// }, gantt._isProject = function(t) {
//   return !this._isTask(t)
// }, gantt._formatSuccessors = function(t, n) {
//   for (var a = [], e = 0; e < t.length; e++) a.push(this._formatSuccessor(t[e], n));
//   return a
// }, gantt._formatSuccessor = function(t, n) {
//   return {
//     task: t,
//     link: n
//   }
// }, gantt._getSuccessors = function(t) {
//   var n = [];
//   if (gantt._isProject(t)) n = n.concat(gantt._formatSuccessors(gantt._branches[t.id] || [], null));
//   else
//     for (var a = t.$source, e = 0; e < a.length; e++) {
//       var i = this.getLink(a[e]),
//         r = this.getTask(i.target);
//       this._isTask(r) ? n.push(gantt._formatSuccessor(i.target, i.type)) : n = n.concat(gantt._formatSuccessors(gantt._branches[r.id] || [], i.type))
//     }
//   return n
// };
//# sourceMappingURL=../sources/ext/dhtmlxgantt_critical_path.js.map