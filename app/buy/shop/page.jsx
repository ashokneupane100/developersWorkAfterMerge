// app/buy/house/page.jsx
import ListingMapView from "@/app/_components/ListingMapView";

export default function BuyShopPage() {
  return (
    <div className="p-[.01em] pt-[-2rem]">
      <ListingMapView action="Sell" propertyType="Shop"/>
    </div>
  );
}