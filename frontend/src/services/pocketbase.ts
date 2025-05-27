import { TypedPocketBase } from '@/types/pocketbase-types'
import PocketBase from 'pocketbase'

const pb = new PocketBase() as TypedPocketBase

pb.autoCancellation(false)

export default pb