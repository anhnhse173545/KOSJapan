import { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, Loader2, CreditCard } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KoiDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [koi, setKoi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const koiImages = [
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dgrOuDD7ggYB2igDa3ANE2SVnAZ7ft.png',
    'https://cecilieo.com/content/images/wordpress/2020/11/koi-fish-reference-photo-2.jpg/placeholder.svg?height=400&width=600',
    'https://cecilieo.com/content/images/wordpress/2020/11/koi-fish-reference-photo-2.jpg/placeholder.svg?height=400&width=600',
    'https://cecilieo.com/content/images/wordpress/2020/11/koi-fish-reference-photo-2.jpg/placeholder.svg?height=400&width=600',
  ]

  const fishPackImages = [
    'https://smithcreekfishfarm.com/cdn/shop/files/kolubek-livestock-fish-shipped-koi-packages-shipped-free-koi-fish-assortment-3-12-pack-shipped-standard-or-butterfly-fins-44441180864809_1024x.jpg?v=1706511776/placeholder.svg?height=300&width=400',
    'https://smithcreekfishfarm.com/cdn/shop/files/kolubek-livestock-fish-shipped-koi-packages-shipped-free-koi-fish-assortment-3-12-pack-shipped-standard-or-butterfly-fins-44441180864809_1024x.jpg?v=1706511776/placeholder.svg?height=300&width=400',
    'https://smithcreekfishfarm.com/cdn/shop/files/kolubek-livestock-fish-shipped-koi-packages-shipped-free-koi-fish-assortment-3-12-pack-shipped-standard-or-butterfly-fins-44441180864809_1024x.jpg?v=1706511776/placeholder.svg?height=300&width=400',
  ]

  const getRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  }

  useEffect(() => {
    const fetchKoi = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/fish-order/customer/AC0007`)
        const order = response.data.find(order => order.id === id)
        if (order) {
          setKoi(order)
        } else {
          setError('Koi order not found')
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchKoi()
  }, [id])

  const handleReject = async () => {
    try {
      const apiUrl = `http://localhost:8080/fish-order/${koi.id}/${koi.farmId}/update`
      const updatedData =
        koi.paymentStatus === 'Deposited'
          ? { paymentStatus: 'Rejected' }
          : { status: 'Rejected' }
      
      await axios.put(apiUrl, updatedData)
      if (updatedData.paymentStatus) {
        setKoi(prev => ({ ...prev, paymentStatus: 'Rejected' }))
      } else {
        setKoi(prev => ({ ...prev, status: 'Rejected' }))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      setError('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!koi) {
    return <div className="text-center">Koi not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Koi Detail</h1>

        {koi.fishOrderDetails.map((orderDetail, index) => (
          <motion.div
            key={orderDetail.fish.fish_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{orderDetail.fish.fish_variety_name}</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={getRandomImage(koiImages)}
                    alt={orderDetail.fish.fish_variety_name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold">Koi ID:</span> {orderDetail.fish.fish_id}</p>
                  <p><span className="font-semibold">Length:</span> {orderDetail.fish.length} cm</p>
                  <p><span className="font-semibold">Weight:</span> {orderDetail.fish.weight} kg</p>
                  <p><span className="font-semibold">Description:</span> {orderDetail.fish.description}</p>
                  <p><span className="font-semibold">Price:</span> ${orderDetail.price}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div className="mt-8 space-y-4">
          {['Pending', 'Deposited', 'In Transit', 'Delivering'].includes(koi.status) && (
            <Button 
              className="w-full"
              variant="destructive"
              onClick={handleReject}
            >
              Rejected
            </Button>
          )}

          {koi.paymentStatus === 'Pending' && (
            <Button 
              className="w-full"
              onClick={() => navigate(`/paykoi50/${koi.id}`)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase
            </Button>
          )}

          {koi.status === 'Delivering' && (
            <Button 
              className="w-full"
              onClick={() => navigate(`/paykoi100/${koi.id}`)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Finish Payment
            </Button>
          )}

          <Link to="/mykoi" className="block text-center">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to My Koi
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
