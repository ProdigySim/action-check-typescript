import { shortenMessage } from "../src/getBodyComment";

describe("#shortenMessage", () => {
  it('should shorten long type specifications', () => {
    const msg = `Overload 1 of 2, '(props: Omit<Omit<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<...>> & { ...; } & { ...; }, "width"> & Partial<...>, "theme"> & { ...; } & { ...; }): ReactElement<...>', gave the following error.
      Type '{ children: string; bold: true; key: string; smallText: true; valignBottom: true; width: string; }' is not assignable to type 'IntrinsicAttributes & Omit<Omit<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<HTMLTableDataCellElement>> & { ref?: ((instance: HTMLTableDataCellElement | null) => void) | RefObject<HTMLTableDataCellElement> | null | undefined; } & { width: string | number | undefined; }, "width"> & Partial<Pick<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<HTMLTableDataCellElement>> & { ref?: ((instance: HTMLTableDataCellElement | null) => void) | RefObject<HTMLTableDataCellElement> | null | undefined; } & { width: string | number | undefined; }, "width">>, "theme"> & { theme?: any; } & { as?: undefined; forwardedAs?: undefined; }'`;
  
      expect(shortenMessage(msg)).toMatch(/'\(props: Omit<Omit<Pick<DetailedHTMLProps.*?\.\.\.'/);
      expect(shortenMessage(msg)).toMatch(/'\{ children: string; bold: true; .*?\.\.\.'/);
      expect(shortenMessage(msg)).toMatch(/'IntrinsicAttributes & Omit<Omit<Pick.*?\.\.\.'/);
  });
  it('should trim to maxLength', () => {
    const msg = `Overload 1 of 2, '(props: Omit<Omit<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<...>> & { ...; } & { ...; }, "width"> & Partial<...>, "theme"> & { ...; } & { ...; }): ReactElement<...>', gave the following error.
      Type '{ children: string; bold: true; key: string; smallText: true; valignBottom: true; width: string; }' is not assignable to type 'IntrinsicAttributes & Omit<Omit<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<HTMLTableDataCellElement>> & { ref?: ((instance: HTMLTableDataCellElement | null) => void) | RefObject<HTMLTableDataCellElement> | null | undefined; } & { width: string | number | undefined; }, "width"> & Partial<Pick<Pick<DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "key" | keyof TdHTMLAttributes<HTMLTableDataCellElement>> & { ref?: ((instance: HTMLTableDataCellElement | null) => void) | RefObject<HTMLTableDataCellElement> | null | undefined; } & { width: string | number | undefined; }, "width">>, "theme"> & { theme?: any; } & { as?: undefined; forwardedAs?: undefined; }'`;
  
      expect(shortenMessage(msg, 100)).toHaveLength(100);
  });
});