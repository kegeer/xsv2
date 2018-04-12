import React from 'react';
import Popover from 'components/Popover';
import UserAvatar from 'components/Avatar';
import { options, groupAndOrderReactions } from './utils';

const Reactions = (props) => {
  const { reactions, submitFn } = props;
  const groupedReactions = reactions && reactions.length > 0 ? groupAndOrderReactions(reactions, options) : [];

  return (
    <span>
      { groupedReactions.map(reaction => (
        <Popover
          key={reaction.type}
          preferPlace="below"
          trigger="hoverDelay"
        >
          <a onClick={() => submitFn(reaction.type)}>
            { reaction.icon }
            <span>{ reaction.list.length }</span>
          </a>
          <PopoverMenu>
            { reaction.list.map(userReaction => (
              <Link to="/user" />
            ))}
          </PopoverMenu>
        </Popover>
      ))}
    </span>
  );
};
