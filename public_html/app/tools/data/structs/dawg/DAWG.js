/**
 * An implementation of a Directed Acycilic Word Graph.
 *
 * @class DAWG
 *
 * @see {@link https://github.com/nyxtom/text-tree/blob/master/lib/bla.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone'], function(Phone){

	var Constructor = function(indices){
		this.nodes = indices;
	};


	var contains = function(word){
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var ptr = this.nodes[0];
		var result = word.some(function(chr){
			ptr = this.findChild(ptr, chr);
			return (ptr >= 0);
		});
		return (result && Node.canTerminate(ptr));
	};

	/** @private */
	var findChild = function(int node, char c){
		for(Iterator<Integer> iter = new ChildIterator(node); iter.hasNext(); ){
			int child = iter.next();

			if(getChar(child) == c)
				return child;
		}
		return -1;
	}

/*
public class Dawg{

  private static final Pattern LETTERS_REGEX = Pattern.compile ("[A-Za-z?]+");
  private static final Pattern PATTERN_REGEX = Pattern.compile ("\\$?[A-Z?]*\\$?");

  /**
   * Given a subset of source letters and a possible pattern, find words that would satisfy the conditions.
   *
   * @param letters Confining set of letters to choose from. Use ? for wildcards
   * @param pattern Pattern for words. Use '?' for single letter wildcard. Use '*' for multiple letter wildcard.
   * @return An array of letters.
   * /
  public Result[] subwords (String letters, String pattern)
    // yes, there's a lot of repeated code here.  it might get cleaned up at the end.
  {
    if (!lettersValid (letters))
      return null;

    if (!patternValid (pattern))
      return null;

    List<PatternToken> patternTokens = processPattern (pattern);
    int tokenCount = patternTokens.size ();

    Set<Result> results = new HashSet<Result> (); // the running list of subwords

    Stack<StackEntry> stack = new Stack<StackEntry> ();  // a stack of paths to traverse. This prevents the StackOverflowException.
    stack.push (new StackEntry (nodes[0], letters.toUpperCase ().toCharArray (), "", 0));

    while (!stack.empty ())
    {
      StackEntry entry = stack.pop ();
      int patternIndex = entry.patternIndex;
      char[] chars = entry.chars;

      int node = entry.node;
      char nodeValue = getChar (node);

      if (patternIndex < tokenCount) // match the pattern
      {
        PatternToken patternToken = patternTokens.get (patternIndex);
        if (patternToken.required)
        {
          StringBuilder nextSubwordBuilder = new StringBuilder (entry.subword.length () + 1).append (entry.subword);
          List<Integer> nextWildcardPositions = entry.wildcardPositions;
          switch (patternToken.letter)
          {
            case '?': // the node value needs to be in the letters
              if (ArrayUtils.contains (chars, nodeValue))
                chars = ArrayUtils.removeElement (chars, nodeValue);
              else if (ArrayUtils.contains (chars, '?'))
              {
                chars = ArrayUtils.removeElement (chars, '?');
                if (nextWildcardPositions == null)
                  nextWildcardPositions = new ArrayList<Integer> ();
                else nextWildcardPositions = new ArrayList<Integer> (entry.wildcardPositions);
                nextWildcardPositions.add (entry.subword.length ());
              }
              else continue;

              nextSubwordBuilder.append (nodeValue);
              break;
            case (char) -1:
              if (canTerminate (node))
                results.add (new Result (entry.subword, nextWildcardPositions));
              continue;
            default:
              if (nodeValue != patternToken.letter)
                continue;
              if (0 != nodeValue)
                nextSubwordBuilder.append (nodeValue);
              break;
          }
          ++patternIndex;

          // if we just fulfilled the last token, see if the subword can terminate
          if ((patternIndex == tokenCount) && canTerminate (node))
            results.add (new Result (nextSubwordBuilder.toString (), nextWildcardPositions));

          // lookahead to the next token and put a candidate on the stack
          addCandidates (stack, patternTokens, patternIndex, node, chars, nextSubwordBuilder.toString (), nextWildcardPositions);
        }
        else // optional pattern match
        {
          if (node == nodes[0])
          {
            addCandidates (stack, patternTokens, patternIndex, node, chars, entry.subword, entry.wildcardPositions);
          }
          else if ('?' == patternToken.letter)
          {
            // whether we match the pattern or not, it must be in the letters
            List<Integer> nextWildcardPositions = entry.wildcardPositions;
            StringBuilder nextSubwordBuilder =
              new StringBuilder (entry.subword.length () + 1).append (entry.subword).append (nodeValue);
            char[] nextChars;

            if (ArrayUtils.contains (chars, nodeValue))
              nextChars = ArrayUtils.removeElement (chars, nodeValue);
            else if (ArrayUtils.contains (chars, '?'))
            {
              nextChars = ArrayUtils.removeElement (chars, '?');
              if (nextWildcardPositions == null)
                nextWildcardPositions = new ArrayList<Integer> ();
              else nextWildcardPositions = new ArrayList<Integer> (entry.wildcardPositions);
              nextWildcardPositions.add (entry.subword.length ());
            }
            else continue;

            // match the pattern
            {
              int nextPatternIndex = patternIndex + 1;

              // if we just fulfilled the last token, see if the subword can terminate
              if ((nextPatternIndex == tokenCount) && canTerminate (node))
                results.add (new Result (nextSubwordBuilder.toString (), nextWildcardPositions));

              // lookahead to the next token and put a candidate on the stack
              addCandidates (stack, patternTokens, nextPatternIndex, node, nextChars, nextSubwordBuilder.toString (), nextWildcardPositions);
            }

            // don't match the pattern
            // lookahead to the next token and put a candidate on the stack
            addCandidates (stack, patternTokens, patternIndex, node, nextChars, nextSubwordBuilder.toString (), nextWildcardPositions);
          }
          else
          {
            StringBuilder nextSubwordBuilder =
              new StringBuilder (entry.subword.length () + 1).append (entry.subword).append (nodeValue);

            // match the letters, not the pattern
            {
              List<Integer> nextWildcardPositions = entry.wildcardPositions;
              char[] nextChars = null;
              boolean found = true;

              if (ArrayUtils.contains (chars, nodeValue))
                nextChars = ArrayUtils.removeElement (chars, nodeValue);
              else if (ArrayUtils.contains (chars, '?'))
              {
                nextChars = ArrayUtils.removeElement (chars, '?');
                if (nextWildcardPositions == null)
                  nextWildcardPositions = new ArrayList<Integer> ();
                else nextWildcardPositions = new ArrayList<Integer> (entry.wildcardPositions);
                nextWildcardPositions.add (entry.subword.length ());
              }
              else found = false;

              if (found)
                // lookahead to the next token and put a candidate on the stack
                addCandidates (stack, patternTokens, patternIndex, node, nextChars, nextSubwordBuilder.toString (), nextWildcardPositions);
            }

            // match the pattern, not the letters
            if (nodeValue == patternToken.letter)
            {
              int nextPatternIndex = patternIndex + 1;

              // if we just fulfilled the last token, see if the subword can terminate
              if ((nextPatternIndex == tokenCount) && canTerminate (node))
                results.add (new Result (nextSubwordBuilder.toString (), entry.wildcardPositions));

              // lookahead to the next token and put a candidate on the stack
              addCandidates (stack, patternTokens, nextPatternIndex, node, chars, nextSubwordBuilder.toString (), entry.wildcardPositions);
            }
          }
        }
      }
      else // no pattern to match
      {
        StringBuilder nextSubwordBuilder = new StringBuilder (entry.subword.length () + 1).append (entry.subword);
        List<Integer> nextWildcardPositions = entry.wildcardPositions;
        char[] nextChars = entry.chars;

        if (node != nodes[0])
        {
          if (ArrayUtils.contains (chars, nodeValue))
            nextChars = ArrayUtils.removeElement (chars, nodeValue);
          else if (ArrayUtils.contains (chars, '?'))
          {
            nextChars = ArrayUtils.removeElement (chars, '?');
            if (nextWildcardPositions == null)
              nextWildcardPositions = new ArrayList<Integer> ();
            else nextWildcardPositions = new ArrayList<Integer> (entry.wildcardPositions);
            nextWildcardPositions.add (entry.subword.length ());
          }
          else continue;

          if (0 != nodeValue)
            nextSubwordBuilder.append (nodeValue);

          if (canTerminate (node))
            results.add (new Result (nextSubwordBuilder.toString (), nextWildcardPositions));
        }

        // find the next candidate from the letters
        addCandidatesFromLetters (stack, node, nextChars, nextSubwordBuilder.toString (), nextWildcardPositions, patternIndex);
      }
    }
    return results.toArray (new Result[results.size ()]);
  }

  private boolean lettersValid (String letters)
  {
    if ((null == letters) || (letters.length () < 2))
      return false;

    return LETTERS_REGEX.matcher (letters).matches ();
  }

  private boolean patternValid (String pattern)
  {
    return null == pattern || PATTERN_REGEX.matcher (pattern).matches ();

  }

  private List<PatternToken> processPattern (String pattern)
  {
    List<PatternToken> patternTokens = new ArrayList<PatternToken> ();

    if ((null != pattern) && (pattern.length () != 0))
    {
      /* The first character of a pattern can either be $, ?, or a letter.
         If it's $, we must match root.
         If it's ?, we have leading wildcard matching.  Count how many lead, then adjust the first letter token.
         If it's a letter, then we optionally match the letter.

         No matter what, all letters for the rest of the pattern are required in order.
      * /

      int length = pattern.length ();
      char firstChar = pattern.charAt (0);

      if ('$' == firstChar)
        patternTokens.add (new PatternToken ((char) 0, true)); // start of word. must match root
      else patternTokens.add (new PatternToken (firstChar, false));  // add with the number of leading chars needed

      for (int i = 1; i < length - 1; ++i) // process everything but the last character, which might be terminator $
        patternTokens.add (new PatternToken (pattern.charAt (i), true));

      char lastChar = pattern.charAt (length - 1);
      if (length > 1)
      {
        if (('$' == lastChar))
          patternTokens.add (new PatternToken ((char) -1, true));
        else patternTokens.add (new PatternToken (lastChar, true));
      }
    }
    return patternTokens;
  }

  /**
   * Finds the candidates for next node.
   *
   * Note. The long parameter list is because we're trying to minimize allocations.  We could put the candidates in a
   * collection and return that to be iterated and put on the stack.  That would shrink the parameter list.  Given how
   * often this function is called, that would generate lots of allocations.  In fact, this method originally did return
   * a collection of Nodes, and the Android Logcat showed exorbitant GC.  So now, we have a long parameter list (uglier
   * code), but significantly fewer allocations.
   * /
  private void addCandidates (Stack<StackEntry> stack, List<PatternToken> patternTokens, int patternIndex,
                              int node, char[] letters, String subword, List<Integer> wildcardPositions)
  {
    if (patternIndex < patternTokens.size ())
    {
      PatternToken patternToken = patternTokens.get (patternIndex);
      if (patternToken.required)
      {
        switch (patternToken.letter)
        {
          case '?':
            for (char letter : getUniqueLetters (letters))
            {
              if (ArrayUtils.contains (letters, '?'))
                for (Iterator<Integer> iter = childIterator (node); iter.hasNext (); )
                  stack.push (new StackEntry (iter.next (), letters, subword, wildcardPositions, patternIndex));
              else
              {
                int candidate = findChild (node, letter);
                if (-1 != candidate)
                  stack.push (new StackEntry (candidate, letters, subword, wildcardPositions, patternIndex));
              }
            }
            break;
          case (char) -1:
            stack.push (new StackEntry (node, letters, subword, wildcardPositions, patternIndex));
            break;
          default:
            int candidate = findChild (node, patternToken.letter);
            if (-1 != candidate)
              stack.push (new StackEntry (candidate, letters, subword, wildcardPositions, patternIndex));
            break;
        }
      }
      else // since this token isn't required, all the children that are in the letters and the letter from the pattern
      {
        if (patternToken.letter != '?')
        {
          int candidate = findChild (node, patternToken.letter);
          if (candidate != -1)
            stack.push (new StackEntry (candidate, letters, subword, wildcardPositions, patternIndex));
        }

        addCandidatesFromLetters (stack, node, letters, subword, wildcardPositions, patternIndex);
      }
    }
    else addCandidatesFromLetters (stack, node, letters, subword, wildcardPositions, patternIndex);
  }

  private void addCandidatesFromLetters (Stack<StackEntry> stack, int node, char[] letters, String subword,
                                         List<Integer> wildcardPositions, int patternIndex)
  {
    if (ArrayUtils.contains (letters, '?')) // there's a wildcard, add all the children
      for (Iterator<Integer> iter = childIterator (node); iter.hasNext ();)
        stack.push (new StackEntry (iter.next (), letters, subword, wildcardPositions, patternIndex));
    else // add the children that match a letter
      for (char letter: getUniqueLetters (letters))
      {
        int candidate = findChild (node, letter);
        if (-1 != candidate)
          stack.push (new StackEntry (candidate, letters, subword, wildcardPositions, patternIndex));
      }
  }

  private Set<Character> getUniqueLetters (char[] letters)
  {
    Set<Character> uniqueLetters = new HashSet<Character> ();
    for (char letter : letters)
      uniqueLetters.add (letter);

    return uniqueLetters;
  }

  public class Result
  {
    public final String word;
    public int[] wildcardPositions = null;

    private Result (String word, List<Integer> wildcardPositions)
    {
      this.word = word;

      if (null != wildcardPositions)
      {
        int size = wildcardPositions.size ();
        this.wildcardPositions = new int[size];
        for (int i = 0; i < size; ++i)
          this.wildcardPositions[i] = wildcardPositions.get (i);
      }
    }

    @Override
    public boolean equals (Object obj)
    {
      if (this == obj)
        return false;
      if (getClass () != obj.getClass ())
        return false;

      Result other = (Result) obj;
      return word.equals (other.word);
    }

    @Override
    public int hashCode ()
    {
      return word.hashCode ();
    }
  }

  private class ChildIterator implements Iterator<Integer>
  {
    int childIndex;
    int child;

    private ChildIterator (int parent)
    {
      childIndex = getFirstChildIndex (parent);
    }

    public boolean hasNext ()
    {
      if (-1 == childIndex)
        return false;

      if (isLastChild (child))
        return false;

      return true;
    }

    public Integer next ()
    {
      if (!hasNext ())
        throw new NoSuchElementException ();

      return (child = nodes[childIndex++]);
    }

    public void remove ()
    {
      throw new UnsupportedOperationException ("You may not remove children from this structure");
    }
  }

  public static Set<String> extractWords (Result[] results)
  {
    Set<String> words = new HashSet<String> ();
    for (Result result: results)
      words.add (result.word);

    return words;
  }

  private static int getFirstChildIndex (int node)
  {
    return (node >> 10);
  }

  private static boolean isLastChild (int node)
  {
    return (((node >> 9) & 0x1) == 1);
  }

  private static char getChar (int node)
  {
    return (char) (node & 0xFF);
  }

  /**
   * Used by subwords to figure out pattern matching.
   * /
  private class PatternToken
  {
    public PatternToken (char letter)
    {
      this.letter = letter;
    }

    public PatternToken (char letter, boolean required)
    {
      this.letter = letter;
      this.required = required;
    }

    public final char letter;
    public boolean required = false;  // if the letter is not required, it's optional
  }

  /**
   * Used by subwords to keep track of candidates.  StackOverflowException avoidance.
   * /
  private class StackEntry
  {
    public StackEntry (int node, char[] chars, String subword, int patternIndex)
    {
      this.node = node;             // the current node to examine
      this.chars = chars.clone ();  // the available letters for word building
      this.subword = subword;       // the letter path so far
      this.patternIndex = patternIndex;
    }

    public StackEntry (int node, char[] chars, String subword, List<Integer> wildcardPositions, int patternIndex)
    {
      this (node, chars, subword, patternIndex);
      this.wildcardPositions = wildcardPositions;
    }

    public final int node;
    public final char[] chars;
    public final String subword;
    public List<Integer> wildcardPositions = null;
    public final int patternIndex;
  }

  public static void main(String[] args) throws IOException{
    Dawg dawg = Dawg.load(Dawg.class.getResourceAsStream("/twl06.dat"));

    InputStreamReader isr = new InputStreamReader(System.in);
    BufferedReader reader = new BufferedReader(isr);

    StopWatch stopWatch = new StopWatch();

    while(true){
      System.out.print("letters:  ");
      String letters = reader.readLine();
      System.out.print("pattern:  ");
      String pattern = reader.readLine();

      stopWatch.reset();
      stopWatch.start();
      Result[] results = dawg.subwords(letters.toUpperCase(), pattern.toUpperCase());
      stopWatch.stop();

      if(results != null){
        System.out.println();

        for(Result result : results){
          StringBuilder message = new StringBuilder(result.word);
          if(result.wildcardPositions != null){
            message.append(" with wildcards at");
            for(int position : result.wildcardPositions)
              message.append(" ").append(position);
          }
          System.out.println(message.toString ());
          System.out.println();
        }

        System.out.println("Found " + results.length + " matches in " + stopWatch.getTime () + " ms.");
      }

      System.out.println();
    }
  }
}*/


	Constructor.prototype = {
		constructor: Constructor,

		nodeCount: function(){ return this.nodes; },
		contains: contains,
		/*remove: remove,
		removeAll: removeAll,
		findPrefix: findPrefix,
		apply: apply,
		getWords: getWords,
		findMatchesOnPath: findMatchesOnPath*/
	};

	return Constructor;

});
