import dbConnect from '../../lib/dbConnect';
import Concern from '../../models/Concern';
import ConcernTreatment from '../../models/ConcernTreatment';
import Treatment from '../../models/Treatment';
import Package from '../../models/Package';

export default async function handler(req, res) {
  await dbConnect();
  const concernQuery = req.query.concern?.toLowerCase() || '';
  if (!concernQuery) return res.status(400).json({ error: 'Concern required' });

  // Simple exact match; extend for synonyms as bonus
  const concern = await Concern.findOne({ name: concernQuery });
  if (!concern) return res.json({ concern: null, treatments: [], packages: [] });

  const concernTreatments = await ConcernTreatment.find({ concern: concern._id }).populate('treatment');
  const treatments = concernTreatments.map(ct => ct.treatment);

  // Get all packages for these treatments
  const packages = await Package.find({ treatment: { $in: treatments.map(t => t._id) } })
    .populate('treatment');

  res.json({
    concern,
    treatments,
    packages
  });
}
