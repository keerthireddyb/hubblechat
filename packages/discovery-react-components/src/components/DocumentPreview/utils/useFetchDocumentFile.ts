import { useContext, useCallback, useState } from 'react';
import { QueryResult } from 'ibm-watson/discovery/v2';
import { SearchContext } from 'components/DiscoverySearch/DiscoverySearch';
import useAsyncFunctionCall from 'utils/useAsyncFunctionCall';
import { DocumentFile } from '../types';
import { document as epson } from '../__fixtures__/epson_g3_robot_manual(r14).pdf';
import { document as saw_chamfer } from '../__fixtures__/6087- Manual (SAW-CHAMFER).pdf';

/**
 * When the "file" prop is provided, just return it.
 * Otherwise, fetch the file with the documentProvider.
 * If the fetching time exceeds "fetchTimeout", nothing will be returned.
 */
export function useFetchDocumentFile({
  file,
  document,
  fetchTimeout
}: {
  file?: DocumentFile;
  document?: QueryResult;
  fetchTimeout?: number;
}) {
  const { documentProvider } = useContext(SearchContext);
  const [fetchedFile, setFetchedFile] = useState<DocumentFile>();
  const [isFetching, setIsFetching] = useState(false);

  useAsyncFunctionCall(
    useCallback(
      async (signal: AbortSignal) => {
        if (!file && document && documentProvider) {
          setIsFetching(true);
          setFetchedFile(undefined);

          const fetchData = async () => {
            const hasFile = await documentProvider.provides(document);
            if (hasFile) {
              const fetchedData = await documentProvider.get(document);
              if (typeof fetchedData === 'string' || fetchedData instanceof ArrayBuffer) {
                return fetchedData;
              } else if (fetchedData?.type === 'pdf') {
                return fetchedData.source;
              }
            } else if (document.extracted_metadata.filename === 'epson_g3_robot_manual(r14).pdf') {
              return atob(epson);
            } else if (
              document.extracted_metadata.filename === '6087- Manual (SAW-CHAMFER)-1.pdf'
            ) {
              return atob(saw_chamfer);
            }
            return undefined;
          };

          const fetchedData = await Promise.race([
            fetchData(),
            ...(fetchTimeout
              ? [new Promise(resolve => setTimeout(() => resolve(undefined), fetchTimeout))]
              : [])
          ]);

          if (!signal.aborted) {
            setIsFetching(false);
            setFetchedFile(fetchedData as DocumentFile);
          }
        }
      },
      [file, fetchTimeout, document, documentProvider]
    )
  );

  return {
    providedFile: file || fetchedFile,
    isFetching
  };
}
