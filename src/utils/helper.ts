function convertSortQuery(sort: string | Array<string>) {
  if (typeof sort === 'string') {
    if (sort[0] === '-') {
      return {
        [sort.substring(1)]: 'desc',
      };
    } else {
      return {
        [sort]: 'asc',
      };
    }
  } else {
    return sort.map((item) => {
      if (item[0] === '-') {
        return {
          [item.substring(1)]: 'desc',
        };
      } else {
        return {
          [item]: 'asc',
        };
      }
    });
  }
}

export { convertSortQuery };
