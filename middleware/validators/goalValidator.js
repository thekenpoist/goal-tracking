const { body } = require('express-validator');

exports.createGoalRules = [
    body('title')
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters.'),
    body('category')
        .isIn([
            'Health & Fitness', 
            'Career & Work', 
            'Learning & Education', 
            'Finances', 
            'Relationships & Family',
            'Mind & Spirit', 
            'Home & Organization', 
            'Creative & Hobbies', 
            'Animal Care & Connection', 
            'Miscellaneous'])
        .withMessage('Invalid category selected.'),
    body('description')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters.'),
    body('priority')
        .optional({ checkFalsy: ture })
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('startDate')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Start date must be a valid date.')
        .toDate(),
    body('endDate')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('End date must be a valid date.')
        .toDate()
        .custom(( value, { req }) => {
            if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date cannot be before start date.');
            }
            return true;
        })
];

