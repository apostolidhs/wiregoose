import _ from 'lodash';

const events = {};

export function subscribe(name, func) {
  const queue = events[name] || [];
  events[name] = queue;

  queue.push(func);
}

export function unsubscribe(name, func) {
  _.remove(events[name], queueFunc => queueFunc === func);
}

export function publish(name, data) {
  _.each(events[name], queueFunc => queueFunc(data));
}
