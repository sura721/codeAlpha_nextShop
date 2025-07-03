import { Category, Prisma, Product, Review }  from '@/lib/generated/prisma'
const productWithDetails = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    category: true,
    reviews: true,
    variants: {
      orderBy: {
        price: 'asc'
      }
    },
  },
});

export type CartItemType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  inStock: number;
  image: string;
};

export type ProductWithDetails = Prisma.ProductGetPayload<typeof productWithDetails>;

export const cartWithDetailsValidator = Prisma.validator<Prisma.CartDefaultArgs>()({
  include: {
    items: {
      // orderBy: { createdAt: 'asc' }, // REMOVE THIS LINE
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    },
  },
});

export type CartWithDetails = Prisma.CartGetPayload<typeof cartWithDetailsValidator>;



export type ShippingDataType = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
};

export type PaymentDataType = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
};

export type ShippingMethodType = {
  id: string;
  name: string;
  price: number;
  delivery: string;
};

export interface ShippingStepProps {
  shippingData: ShippingDataType;
  setShippingData: React.Dispatch<React.SetStateAction<ShippingDataType>>;
  onSuccess: () => void;
}

export interface PaymentStepProps {
  paymentData: PaymentDataType;
  setPaymentData: React.Dispatch<React.SetStateAction<PaymentDataType>>;
  shippingMethod: ShippingMethodType;
  setShippingMethod: React.Dispatch<React.SetStateAction<ShippingMethodType>>;
  onBack: () => void;
  onSuccess: () => void;
}

export interface ReviewStepProps {
  shippingData: ShippingDataType;
  shippingMethod: ShippingMethodType;
  paymentData: PaymentDataType;
  onBack: () => void;
  onPlaceOrder: () => void;
  isPending: boolean;
}