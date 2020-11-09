import css from 'styled-jsx/css';
import { styleHelpers, buildStyleSheet } from '../utils';

const row = css.resolve`
  * {
    ${styleHelpers.flex('row')};
    align-items: center;
    margin: ${styleHelpers.spacing(3, 0)};
  }
`;

const aside = css.resolve`
  * {
    ${styleHelpers.flex('row')};
    align-items: center;
  }
`;


const column = css.resolve`
  * {
    ${styleHelpers.flex('column')};
    max-width: 100%;
  }
`;


const avatar = css.resolve`
  * {
    ${styleHelpers.hideLink()};
    height: 40px;
    width: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    margin-right: ${styleHelpers.spacing(2)};
  }

  @media ${styleHelpers.mediaQuery('xs', 'sm')} {
    * {
      display: none;
    }
  };

  @media print {
    * {
      display: none;
    }
  };
`;

const initials = css.resolve`
  * {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    line-height: 40px;
    text-align: center;
    background-color: ${styleHelpers.color('text')};
    color: ${styleHelpers.color('background_light')};
    font-weight: 600;
  }

  @media ${styleHelpers.mediaQuery('xs', 'sm')} {
    * {
      display: none;
    }
  };

  @media ${styleHelpers.printMediaQuery('xs', 'sm')} {
    * {
      display: none;
    }
  };
`;


const date = css.resolve`
  * {
    color: ${styleHelpers.color('textMuted')};
  }
`;


const author = css.resolve`
  * {
    color: ${styleHelpers.color('accent_main')};
    display: block;
  }
`;


const authors = css.resolve`
  * {
    ${styleHelpers.flex('row')};
    flex-wrap: wrap;
    margin-bottom: ${styleHelpers.spacing(0.4)};
  }

  * * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;


const hideLink = css.resolve`
  * {
    ${styleHelpers.hideLink()};
  }
`;


const breakSpaces = css.resolve`
  * {
    white-space: break-spaces;
  }
`;


const bylineCompact = css.resolve`
  * {
    margin: ${styleHelpers.spacing(1, 0)};
  }
`;


const bylineCompactAuthor = css.resolve`
  * {
    color: ${styleHelpers.color('textMuted')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    font-style: italic;
  }
`;


const bylineCompactDate = css.resolve`
  * {
    color: ${styleHelpers.color('accent_main')};
    margin-right: ${styleHelpers.spacing(2)};
  }
`;


export default buildStyleSheet({
  row,
  column,
  avatar,
  date,
  author,
  authors,
  hideLink,
  breakSpaces,
  bylineCompact,
  bylineCompactAuthor,
  bylineCompactDate,
  initials,
  aside
});