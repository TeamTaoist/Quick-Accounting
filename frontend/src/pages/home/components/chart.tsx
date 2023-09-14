import React, { useEffect, useMemo, useState } from "react";
import chartXkcd from "chart.xkcd";
import { Pie } from "chart.xkcd-react";
import { getTxByWallet } from "../../../request/api";
import { ethers } from "ethers";

type CategoryMap = { [k: string]: ethers.BigNumber };

export default function CharDisplay({
  daoAddress,
  tokenAddress,
}: {
  daoAddress: string;
  tokenAddress: string;
}) {
  const [inCategoriesMap, setInCategoriesMap] = useState<CategoryMap>({});
  const [outCategoriesMap, setOutCategoriesMap] = useState<CategoryMap>({});
  useEffect(() => {
    const getAllTxs = async () => {
      getTxByWallet(daoAddress, tokenAddress)
        .then((res) => {
          const out_categories_set: { [k: string]: ethers.BigNumber } = {};
          const in_categories_set: { [k: string]: ethers.BigNumber } = {};
          res.data.data.forEach(
            ({ attributes: element }: { attributes: any }) => {
              const isOut =
                daoAddress.toLocaleLowerCase() ===
                element.from.toLocaleLowerCase();
              const cat = element.category;
              if (isOut) {
                if (!out_categories_set[cat]) {
                  out_categories_set[cat] = ethers.BigNumber.from(0);
                }
                out_categories_set[cat] = ethers.BigNumber.from(element.value);
              } else {
                if (!in_categories_set[cat]) {
                  in_categories_set[cat] = ethers.BigNumber.from(0);
                }
                in_categories_set[cat] = ethers.BigNumber.from(element.value);
              }
            }
          );
          setInCategoriesMap(in_categories_set);
          setOutCategoriesMap(out_categories_set);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    daoAddress && tokenAddress && getAllTxs();
  }, [daoAddress, tokenAddress]);

  const { categories, data } = useMemo(() => {
    return {
      categories: Object.keys(inCategoriesMap).concat(
        Object.keys(outCategoriesMap)
      ),
      data: Object.values(inCategoriesMap).concat(
        Object.values(outCategoriesMap)
      ),
    };
  }, [inCategoriesMap, outCategoriesMap]);

  if (!categories.length) {
    return <></>;
  }

  return (
    <div>
      <Pie
        config={{
          title: "Finance", // optional
          data: {
            labels: categories,
            datasets: [
              {
                data,
              },
            ],
          },
          options: {
            // optional
            innerRadius: 0.5,
            legendPosition: chartXkcd.config.positionType.upRight,
          },
        }}
      />
    </div>
  );
}
