import { ParamsDto } from '../member/member.dto';

export const getPageParams = (params: ParamsDto | null) => {
  if (!params) {
    return { pageNumber: 1, skip: 0, pageSize: 20 };
  }

  const pageSize = params.pageSize ?? 20;
  const pageNumber = params.pageNumber ?? 1;

  return {
    pageNumber,
    skip: (pageNumber - 1) * pageSize,
    pageSize,
  };
};
