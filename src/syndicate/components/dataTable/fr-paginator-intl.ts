import { MatPaginatorIntl } from '@angular/material';

const frRangeLabel = (page: number, pageSize: number, length: number) => {

  let arraylength = length;

  if (arraylength === 0 || pageSize === 0) {
    return `0 de ${arraylength}`;
  }

  arraylength = Math.max(arraylength, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < arraylength ?
      Math.min(startIndex + pageSize, arraylength) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${arraylength}`;
};


export function getFrPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Éléments par page :';
  paginatorIntl.nextPageLabel = 'Page suivante';
  paginatorIntl.previousPageLabel = 'Page précédente';
  paginatorIntl.getRangeLabel = frRangeLabel;

  return paginatorIntl;
}
