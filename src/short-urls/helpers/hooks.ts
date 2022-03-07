import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { isEmpty, pipe } from 'ramda';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';
import { ShortUrlsOrder, ShortUrlsOrderableFields } from '../data';
import { orderToString, stringToOrder } from '../../utils/helpers/ordering';
import { TagsFilteringMode } from '../../api/types';

type ToFirstPage = (extra: Partial<ShortUrlsFiltering>) => void;

export interface ShortUrlListRouteParams {
  page: string;
  serverId: string;
}

interface ShortUrlsQueryCommon {
  tags?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  tagsMode?: TagsFilteringMode;
}

interface ShortUrlsQuery extends ShortUrlsQueryCommon {
  orderBy?: string;
}

interface ShortUrlsFiltering extends ShortUrlsQueryCommon {
  orderBy?: ShortUrlsOrder;
}

export const useShortUrlsQuery = (): [ShortUrlsFiltering, ToFirstPage] => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ serverId: string }>();

  const query = useMemo(
    pipe(
      () => parseQuery<ShortUrlsQuery>(location.search),
      ({ orderBy, ...rest }: ShortUrlsQuery): ShortUrlsFiltering => !orderBy ? rest : {
        ...rest,
        orderBy: stringToOrder<ShortUrlsOrderableFields>(orderBy),
      },
    ),
    [ location.search ],
  );
  const toFirstPageWithExtra = (extra: Partial<ShortUrlsFiltering>) => {
    const { orderBy, ...mergedQuery } = { ...query, ...extra };
    const normalizedQuery: ShortUrlsQuery = { ...mergedQuery, orderBy: orderBy && orderToString(orderBy) };
    const evolvedQuery = stringifyQuery(normalizedQuery);
    const queryString = isEmpty(evolvedQuery) ? '' : `?${evolvedQuery}`;

    navigate(`/server/${params.serverId}/list-short-urls/1${queryString}`);
  };

  return [ query, toFirstPageWithExtra ];
};