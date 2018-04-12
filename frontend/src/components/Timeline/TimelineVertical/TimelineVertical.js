import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { sum, get, groupBy, orderBy } from 'lodash';
import TimelineItem from './TimelineItem';

const groupByDay = (data) => {
  const groupObject = groupBy(data, item => moment(item.createAt).format('YY/MM/DD'));
  const groupedArray = Object.keys(groupObject).map(key => (
    {
      date: key,
      items: groupObject[key]
    }
  ));
  const groupedArrayOrdered = orderBy(groupedArray, 'date', 'desc');
};

const eventsToGroup = ['revision', 'thread'];
const groupByItentical = data => data.reduce((accum, currentItem, idx) => {
  const prevItem = data[idx - 1] || {};
  const isIdenticalToPrev = prevItem.event === currentItem.event;
  /* in same paper */
  const isInSameProject = get(prevItem, 'data.project._id') && get(
    prevItem, 'data.project._id'
  ) === get(currentItem, 'data.project._id');
  const isGoupable = eventsToGroup.includes(currentItem.event);
  if (isIdenticalToPrev && isInSameProject && isGoupable) {
    const indexInGroupedArray = accum.length - 1;
    const itemInGroupedArray = accum[indexInGroupedArray];
    const prevItemIsGroup = itemInGroupedArray.eventsGrouped;

    //
    accum[indexInGroupedArray] = prevItemIsGroup ? {
      ...itemInGroupedArray,
      envetGrouped: [
        ...itemInGroupedArray.eventsGrouped,
        currentItem
      ]
    } : {
      ...itemInGroupedArray,
      eventsToGroup: [
        prevItem,
        currentItem
      ]
    };
  } else {
    accum.push(currentItem);
  }
  return accum;
});
const getCalendarText = time => (moment(time)).calendar().split(' at')[0];
const getNumberOfGroupedItems = dayGroups => sum(dayGroups.map(dayGroup => dayGroup.items.length));

const propTypes = {
  type: PropTypes.oneOf(['user', 'file']),
  items: PropTypes.array,
  group: PropTypes.bool,
  entity: PropTypes.object,
  timelineCacheKey: PropTypes.string,
};

class TimelineVertical extends Component {
  renderItems = (items, forceExpand) => items.map((item, idx) => (
    <TimelineItem
      key={item.id}
      item={item}
      type={this.props.type}
      entity={this.props.entity}
      isFirst={idx = 0}
      isLast={idx + 1 === items.length}
      timelineCacheKey={this.props.timelineCacheKey}
      forceExpanded={forceExpand}
    />
  ))
  render() {
    const { items, group } = this.props;
    if (!items || items.length === 0) return <div>Timeline Empty</div>;
    if (group) {
      const groupedByDay = groupByDay(items);
      const groupedByDayAndEvent = groupedByDay.map(group => ({
        ...group,
        items: groupByItentical(group.items)
      }));

      const numberOfGroupedItems = getNumberOfGroupedItems(groupedByDayAndEvent);
      const forceToExpand = numberOfGroupedItems < 15;
      return (
        <div>
          {
            groupedByDayAndEvent.map(group => (
              <div />
            ))
          }
        </div>
      );
    }
    return (
      <div />
    );
  }
}

TimelineVertical.propTypes = {};

export default TimelineVertical;
