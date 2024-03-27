interface defType extends Record<string, any> { };

export const sortPopular = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.views - a.views);
  return updatedProducts;
}

export const sortArrival = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.timestamp - a.timestamp);
  return updatedProducts;
}

export const sortViews = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.views - a.views);
  return updatedProducts;
}

export const sortByTime = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => b.timestamp - a.timestamp);
  return updatedList;
}

export const sortByCounter = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => a.counter - b.counter);
  return updatedList;
}

export const sortByPriority = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => b.priority - a.priority);
  return updatedList;
}