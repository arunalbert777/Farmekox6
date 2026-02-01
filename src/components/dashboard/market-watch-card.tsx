"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const prices = [
  { name: "Wheat", price: "₹2,350", change: 2.5 },
  { name: "Rice", price: "₹3,800", change: -1.2 },
  { name: "Maize", price: "₹2,100", change: 0.5 },
];

export function MarketWatchCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("mandi_prices")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("commodity")}</TableHead>
              <TableHead className="text-right">{t("price_per_quintal")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right font-medium flex justify-end items-center gap-2">
                  <span>{item.price}</span>
                  {item.change > 0 ? (
                    <ArrowUp className="size-4 text-green-500" />
                  ) : (
                    <ArrowDown className="size-4 text-red-500" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="link" asChild className="mt-2">
            <Link href="/dashboard/market-watch">{t('market_watch')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
